
export const reactivePromise = <T>(promise: Promise<T>): T => {
    let data = reactive<any>({})
    promise.then(res => {
        patch(res, data, true)
    })
    return data
}

export const refPromise = <T>(promise: Promise<T> | (() => T)): Ref<T> => {
    let data = ref<T | any>()

    if (promise instanceof Promise) {
        promise.then(res => {
            data.value = res
        })
    }
    if (typeof promise === 'function') {
        promise().then(res => {
            data.value = res
        })
    }

    return data
}


type AsyncRefReturnType<T> = Ref<T>&{
  load: () => {},
}
export const asyncRef = <T>(loadFn: () => T, defaultValue: T | undefined = undefined, cache?: string): AsyncRefReturnType<T> => {
    const cachedValue = cache ? JSON.parse(localStorage.getItem(cache) as string) : undefined;
    const data = ref<T>(cachedValue ?? defaultValue) as AsyncRefReturnType<T>;
    const loading = ref(false)
  
    data.load = async () => {
      if(loading.value) return 
      loading.value = true
      try {
        const result = await loadFn();
        data.value = result;
        if (cache) {
          localStorage.setItem(cache, JSON.stringify(result));
        }
      } catch (error) {
        console.error('Error occurred during data loading:', error);
        if (cache) {
          localStorage.removeItem(cache);
        }
      } finally {
        loading.value = false
      }
    }
    
  
    data.load()
    data.loading = loading
 
    return data;
}



export const asyncCtlRef = <T>(
  promiseOrFunction: Promise<T> | (() => T), 
  defaultValue: T | undefined = undefined, 
  cache?: string
): { data: Ref<T>, loading: Ref<boolean>, refresh: () => void } => {
  let data = ref<T | any>(JSON.parse(localStorage.getItem(cache)) || defaultValue);
  let loading = ref<boolean>(false);

  const fetchData = async () => {
    loading.value = true;
    try {
      let result: T;
      if (promiseOrFunction instanceof Promise) {
        result = await promiseOrFunction;
      } else {
        result = await promiseOrFunction();
      }
      data.value = result;
      cache && localStorage.setItem(cache, JSON.stringify(data.value));
    } catch (error) {
      console.error('Error occurred:', error);
      cache && localStorage.removeItem(cache);
      data.value = defaultValue;
    } finally {
      loading.value = false;
    }
  };

  // 初次加载时获取数据
  fetchData();

  // 返回包含 data、loading 和 refresh 方法的对象
  return {
    data,
    loading,
    refresh: fetchData
  };
};

export const lazyRef = (initFn: () => any) => {
    let value = ref()
    let c = computed(initFn)
    let stopWatching = watch(c, () => {
        console.log(c)
        value.value = c.value
    }, {
        immediate: true
    })

    let stopWatching2 = watch(value, (nv) => {
        if (nv != c.value) {
            stopWatching()
            stopWatching2()
        }
    })

    return value
}

export const watchRef = <T>(r: T | (() => T), w: ((nv: any, ov: any) => void | object), options?: WatchOptions<false> | undefined) => {
    let data = ref()
    console.log(isRef(r))
    if (isRef(r)) {
        data = r
    } else if (typeof r === 'function') {
        data.value = lazyRef(r as () => T)
    } else {
        data.value = r
    }

    watch(data, w, options)

    return data

}


export const useAsyncComputed =  (fn:()=>any,init:any)=>{
  let data = ref(init)
  let loading = ref(false)
  let com = computed(fn)

  watch(com,async (nv)=>{
    loading.value = true;
    try {
      data.value = await nv;
    } finally {
      loading.value = false;
    }
  })
  return {
    loading,
    data
  }
}


//这里吗
type InitDataParams = {
}

export const initData = (items:any)=>{

}