import { OutputOptions, RollupBuild } from "rollup";

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)));
}

export function writeBundlesFn(getBundleFn: (format: "esm" | "cjs") => Promise<RollupBuild>, options: OutputOptions[]) {
  return Promise.all(
    options.map(async option => {
      const bundle = await getBundleFn(option.format as "esm" | "cjs");
      await bundle.write(option);
    })
  );
}
