import type { MaybeRefOrGetter, Ref } from "vue";
import { ref, computed, toValue, watch } from "vue";
import { isClient } from "@teek/helper";
import { useMounted } from "./useMounted";
import { useEventListener } from "./useEventListener";

export type StorageType = "localStorage" | "sessionStorage";

export interface StorageEventLike {
  storageArea: Storage | null;
  key: StorageEvent["key"];
  oldValue: StorageEvent["oldValue"];
  newValue: StorageEvent["newValue"];
}

export interface UseStorageOptions<T> {
  /**
   * vue watch 的 flush 选项
   *
   * @default 'pre'
   */
  flush?: "pre" | "post" | "sync";
  /**
   * vue watch 的 deep 选项
   *
   * @default false
   */
  deep?: boolean;
  /**
   * 如果 storage 中没有值，则存储默认值
   *
   * @default true
   */
  writeDefaults?: boolean;
  /**
   * storage 的值是否与默认值合并
   *
   *  @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
  /**
   * 存储值的序列化函数
   *
   * @default JSON.stringify
   */
  serializer?: Serializer<T>;
  /**
   * 是否在 onMounted 阶段读取 storage 的值
   *
   * @default true
   */
  initOnMounted?: boolean;
}

export interface Serializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

export const StorageSerializers: Record<
  "boolean" | "object" | "number" | "any" | "string" | "map" | "set" | "date",
  Serializer<any>
> = {
  boolean: { read: (v: any) => v === "true", write: (v: any) => String(v) },
  object: { read: (v: any) => JSON.parse(v), write: (v: any) => JSON.stringify(v) },
  number: { read: (v: any) => Number.parseFloat(v), write: (v: any) => String(v) },
  any: { read: (v: any) => v, write: (v: any) => String(v) },
  string: { read: (v: any) => v, write: (v: any) => String(v) },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: { read: (v: any) => new Set(JSON.parse(v)), write: (v: any) => JSON.stringify(Array.from(v as Set<any>)) },
  date: { read: (v: any) => new Date(v), write: (v: any) => v.toISOString() },
};

export const guessSerializerType = <T extends string | number | boolean | object | null>(rawInit: T) => {
  if (rawInit == null) return "any";
  if (rawInit instanceof Set) return "set";
  if (rawInit instanceof Map) return "map";
  if (rawInit instanceof Date) return "date";
  if (typeof rawInit === "boolean") return "boolean";
  if (typeof rawInit === "string") return "string";
  if (typeof rawInit === "number") return "number";
  if (typeof rawInit === "object") return "object";
  return "any";
};

/**
 * 可以设置 null 或 undefined 的 ref 类型
 */
export type RemovableRef<T> = Omit<Ref<T>, "value"> & {
  get value(): T;
  set value(value: T | null | undefined);
};

/**
 * 使用 storage 获取 data，且支持响应式
 * 1、外界修改 data 后自动更新 storage
 * 2、任意区修改 data 后，其他区的 data 自动变化（相同的 key）
 *
 * 初始化流程（update 函数）：
 * 1、执行 update 函数，判断 data 是否与 storage 里数据一致，不一致则执行 read 函数
 * 2、read 函数从 storage 根据 key 读取数据给 data，如果数据不存在，则将 defaults 给 data（对象支持浅拷贝合并）
 * 3、onMounted 阶段绑定 storage 事件，该事件绑定 update 函数当外界修改 data 后，触发 storage 事件，将所有区的 data 重新更新
 *
 * 外界修改 data 流程
 * 2、修改 data 后，触发 watch 执行 write 函数
 * 3、write 函数先将 data 存入 storage，后触发 dispatchWriteEvent 函数
 * 4、dispatchWriteEvent 手动触发 storage 事件，storage 事件里执行 update 函数，将所有区的 data 重新更新
 */
export const useStorage = <T extends string | number | boolean | object | null>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storageType: StorageType = "localStorage",
  options: UseStorageOptions<T> = {}
): RemovableRef<T> => {
  const { flush = "pre", deep = true, writeDefaults = true, mergeDefaults = false, initOnMounted } = options;

  // 默认值
  const rawInit: T = toValue(defaults);
  const data = ref(rawInit) as RemovableRef<T>;
  if (!isClient) return data;

  // 获取序列器
  const type = guessSerializerType<T>(rawInit);
  const serializer = StorageSerializers[type];

  const keyComputed = computed<string>(() => toValue(key));

  const storage = storageType === "localStorage" ? localStorage : sessionStorage;

  watch(keyComputed, () => update(), { flush });
  // 外界修改 data 后更新到 storage
  watch(data, () => write(data.value), { flush, deep });

  useMounted(() => {
    if (initOnMounted) update();
  });

  /**
   * 发送自定义 storage 事件，实现数据变化后通知（数据响应式）
   * @remark 使用 useStorage 函数都会绑定 storage 事件（onMounted 里），因此数据写入 storage 后通过该函数触发 storage 事件实现通知
   */
  const dispatchWriteEvent = (oldValue: string | null, newValue: string | null) => {
    if (window) {
      const payload = { key: keyComputed.value, oldValue, newValue, storageArea: storage };
      window.dispatchEvent(new StorageEvent("storage", payload));
    }
  };

  /**
   * 写入数据到 storage，并触发 dispatchWriteEvent 通知
   */
  const write = (val: unknown) => {
    const oldValue = storage.getItem(keyComputed.value);
    if (val == null) {
      dispatchWriteEvent(oldValue, null);
      storage.removeItem(keyComputed.value);
    } else {
      const serialized = serializer.write(val as any);
      if (oldValue !== serialized) {
        storage.setItem(keyComputed.value, serialized);
        dispatchWriteEvent(oldValue, serialized);
      }
    }
  };

  /**
   * 读取 storage 数据
   */
  const read = (event?: StorageEventLike) => {
    const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
      return rawInit;
    }

    if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
      if (type === "object" && !Array.isArray(value)) return { ...(rawInit as any), ...value };
      return value;
    }

    if (typeof rawValue !== "string") return rawValue;
    else return serializer.read(rawValue);
  };

  /**
   * 更新数据
   *
   * @param event 初始化为空，后续数据变化，通过 dispatchWriteEvent 传入
   */
  const update = (event?: StorageEventLike) => {
    if (event && event.storageArea !== storage) return;

    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== keyComputed.value) return;

    if (event?.newValue !== serializer.write(data.value)) data.value = read(event);
  };

  if (!initOnMounted) update();

  useEventListener(() => window, "storage", update, { passive: true });

  return data;
};

export type UseStorageReturn = ReturnType<typeof useStorage>;
