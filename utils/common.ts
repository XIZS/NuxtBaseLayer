export const selectFile = () => {
    return new Promise((resolve, reject) => {
        
        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        document.body.appendChild(fileInput);

        // 用于跟踪用户是否点击了文件选择对话框
        let fileDialogOpened = false;

        // 添加文件选择事件监听器
        fileInput.addEventListener('change', async function() {
            const file = fileInput.files[0];
            console.log(file)
            if (file) {
                // console.log('File selected:', file);
                let filename = generateName(file)
                let {data,error} = await sb().storage.from('common').upload(filename,file,{
                    cacheControl:'3600',
                    upsert:false
                })
                resolve(data.fullPath)
            } else {
                alert('Please select a file first.');
            }
            // 移除文件输入元素
        });

        // 模拟用户点击文件输入元素以选择文件
        fileInput.click();
        document.body.removeChild(fileInput);

    })
        
}

const generateName = (file: File):string => {
    let objectKey
    const date = globalRandomWord(false, 35, 39)
    if (file) {
        if (file.type) {
            const type = file.type.split('/')[1]
            const method = file.type.split('/')[0]
            objectKey = `${method}/${date}.${type}`
        } else if (file.name) {
            const type = file.name.split('.')[1]
            objectKey = `${type}/${date}.${type}`
        }
    }
    return objectKey
}

 const globalRandomWord = (randomFlag: boolean, min: number, max: number) => {
    let str = ''
    let range = min
    const arr = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min// 任意长度
    }
    for (let i = 0; i < range; i++) {
        const pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
    }
    return str
}