// 复制和我一样属性的值
export function OBJAssignExisting(target:any, source:any) {
    // 遍历源对象的所有属性
    Object.keys(source).forEach(key => {
        // 如果目标对象自身拥有该属性，则进行赋值
        if (target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    });
    return target;
}

// Object.assign() 的使用会导致在列表中如果先修改数据，再添加数据时存在修改数据的脏数据内容

// 解决方法1：一个是使用表单的resetFields方法，这个可以直接将对象重置到初始状态，但是每个属性都必须在表单上，且配置prop
// 解决方法2：自己写一个复制函数，每次编辑时进行复制， 此外对象内必须有能修改的所有属性且不能有不可以修改的属性