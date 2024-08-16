import {resolve} from 'path'

/**
 * 将原对象的属性补丁到目标对象上。
 * @param origin - 包含要复制属性的源对象。
 * @param target - 要补丁的目标对象。
 * @param isAll - 如果为 true，则补丁所有来自 origin 的属性；否则，补丁 target 的属性。
 * @returns 补丁后的目标对象。
 */
export const patch = (origin: any, target: any, isAll: boolean = false) => {
    Object.keys(isAll ? origin : target).forEach(item => {
        if (origin[item] != null) {
            if (Array.isArray(origin[item]) && Array.isArray(target[item])) {
                // 如果属性值是数组，进行深拷贝。
                target[item] = JSON.parse(JSON.stringify(origin[item]));
            } else if (typeof origin[item] === 'object' && typeof target[item] === 'object') {
                // 如果属性值是对象类型，递归调用 patch。
                patch(origin[item], target[item]);
            } else {
                // 否则直接赋值。
                target[item] = origin[item];
            }
        }
    });
    return target;
}

/**
 * 解析一个数组或返回数组的函数，并返回结果数组。
 * @param target - 一个数组或返回数组的函数。
 * @param args - 如果 target 是一个函数，则传递给函数的参数。
 * @returns 结果数组。
 */
export const ADParse = <T>(target: Array<any> | ((...args: any[]) => Array<T>), ...args: any[]): Array<T> => {
    if (Array.isArray(target)) {
        return target;
    }
    return target(...args);
}

/**
 * 将目标转换为数组。如果目标为 null，则返回空数组。
 * @param target - 一个数组或其他任何类型。
 * @returns 转换后的数组。
 */
export const AD2A = (target: Array<any> | any): Array<any> => {
    if (target == null) {
        return [];
    }
    if (Array.isArray(target)) {
        return target;
    } else {
        return [target];
    }
}

/**
 * 异步解析一个数组或返回数组的函数，并返回结果数组。
 * @param target - 一个数组或返回数组的函数。
 * @param args - 如果 target 是一个函数，则传递给函数的参数。
 * @returns 结果数组的 Promise。
 */
export const asyncADParse = async <T>(target: Array<any> | ((...args: any[]) => Array<T>), ...args: any[]): Promise<Array<T>> => {
    if (Array.isArray(target)) {
        return target;
    }
    return await target(args);
}

/**
 * 返回给定路径的 S3 URL。
 * @param path - 文件路径。
 * @returns 完整的 S3 URL。
 */
// export const s3 = (path: string) => {
//     return `http://127.0.0.1:54321/storage/v1/object/public/` + path;
// }
export const createMediaGenerate = (url: string) => {
    return (path: string) => {
        return (url+path)
    }
}

/**
 * 根据给定的键和值，将列表转换为对象。
 * @param list - 要转换的列表。
 * @param k - 作为键的属性名，默认为 'k'。
 * @param v - 作为值的属性名，默认为 'v'。
 * @returns 一个包含数组和对象的结果。
 */
export const oa = (list: any[], k: string = 'k', v: string = 'v') => {
    return {
        arr: oa,
        obj: list.reduce((prev: any, next: any) => ({ ...prev, [k]: next }), {})
    }
}

/**
 * 执行一个带有加载状态的函数。
 * @param fn - 要执行的函数。
 * @param loading - 一个可选的 Ref 对象，用于表示加载状态。
 * @returns 一个包含运行函数和加载状态的对象。
 */
export const loadingRun = (fn: (params: any) => any, loading?: Ref<boolean>):{run:()=>void,loading:boolean} => {
    if (loading == null) {
        loading = ref(false);
    }
    let run = async (params: any) => {
        if (loading.value) {
            return;
        }
        loading.value = true;
        try {
            return await fn(params);
        } finally {
            loading.value = false;
        }
    }
    return { run, loading };
}

/**
 * 递归处理每个标签。
 * @param labels - 标签列表。
 * @param processItem - 处理单个标签的函数。
 * @param getChild - 获取子标签的函数。
 */
export const recursionEach = (labels: any[], processItem: (item: any) => void, getChild: (item: any) => any[]) => {
    labels.forEach((item) => {
        let child = getChild(item);
        if (child) {
            recursionEach(child, processItem, getChild);
        }
        processItem(item);
    });
}

/**
 * 显示操作成功的消息。
 * @param msg - 要显示的消息，默认为 '操作成功'。
 */
export const ms = (msg?: string) => {
    message.success(msg ?? '操作成功');
}

/**
 * 显示确认对话框。
 * @param title - 对话框标题。
 * @param msg - 对话框内容。
 * @returns 一个 Promise，表示确认对话框的结果。
 */
export const cfm = (title?: string, msg?: string) => {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: title || '确认执行此操作?',
            content: msg || null,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                resolve();
            }
        });
    });
}

/**
 * 创建一个带有加载状态的函数执行器。
 * @param init - 初始加载状态。
 * @returns 包含加载状态和运行函数的对象。
 */
export const useLoadingRun = (init: boolean) => {
    let loading = ref(init ?? false);

    return {
        loading,
        run: async (fn: () => void) => {
            if (loading.value) {
                return;
            }
            loading.value = true;
            try {
                await fn();
            } finally {
                loading.value = false;
            }
        }
    }
}

/**
 * 导航到指定路径。
 * @param path - 目标路径。
 */
export const to = (path: string,query?:any) => {
    useRouter().push({path,query});
}

/**
 * 复制文本到剪贴板。
 * @param text - 要复制的文本。
 */
export const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

/**
 * 复制文本到剪贴板并显示成功消息。
 * @param text - 要复制的文本。
 */
export const copyMs = (text: string) => {
    copy(text);
    ms('复制成功');
}

interface FormType {
    [key: string]: string
}

// function defineTable<T extends FormType>(options: { form: T, setup: (params: T) => void }) {

// }

// defineTable({
//     form:[
//         {key:'aa'},
//         {key:'bb'}
//     ],
//     setup(params){
//         params.aa
//     }
// })


// function defineTable<T extends FormItem>({
//     form,
//     setup,
// }: {
//     form: T;
//     setup: (params: { [K in T[number]['key']]: string }) => void;
// }) {
//     // 构建 params 对象
//     const params = {} as { [K in T[number]['key']]: string };
//     // 调用 setup 函数并传入 params 对象
//     setup(params);
// }

// // 使用 defineTable 函数并传入 form 数组的定义
// defineTable({
//     form: [
//         { key: 'aa' },
//         { key: 'bb' },
//     ],
//     setup: (params) => {
//         params.
//         // 这里的 params 的类型将会是 { aa: string, bb: string }
//     },
// });
