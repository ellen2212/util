/*判断数据类型*/

function type(data) {
  if(data == null) {
    return data + "";
  }
  let typeGroup = {};
  "Boolean Number String Object Function Array Date RegExp Error".split(" ").map((item,index)=>{
    typeGroup[item] = item.toLocaleLowerCase();
  });
  return (typeof data === 'object' || typeof data === 'function') ? typeGroup[Object.prototype.toString.call(data)] || 'object': (typeof data);
}

function isFunction(data) {
  return type(data) === 'function';
}

function isArray(data) {
  return type(data) === 'array';
}

//plainObject : 除了{}和new Object创建的之外，一个没有原型的对象也是一个存粹的对象

function isPlainObject(obj) {

  //排除非object的类型
  if(!obj || Object.toString.call(obj) !== '[object object]') {
    return false;
  }

  //obj原型不存在 纯对象
  let prop = Object.getPrototypeOf(obj);
  if(!prop) {
    return true;
  }

  //new object创建的对象
  let cons = Object.hasOwnProperty.call(obj,'constructor') ? prop.constructor : null;

  return (typeof cons === 'function' && Object.hasOwnProperty.toString.call(obj) === Object.hasOwnProperty.toString.call(Object));
}

function isEmptyObject(obj) {
  let name;
  for(name in obj) {
    return false;
  }
  return true;
}

/*
* 满足以下3种情况就认为是数组或者是类数组对象
* 1 type array
* 2 length 0
* 3 length存在 并且最后一个元素存在
* */
function isArraylike(obj) {
  let length = !!obj && obj.length;
  let type = type(obj);

  return (type === 'array' || length === 0 || (typeof length === 'number' && length > 0 && (length-1) in obj));
}


function isElement(obj) {
  return (!!obj && obj.nodeType === 1);
}

//数组 浅拷贝
function copy(arr) {
  if(type(arr) === 'array') {
    return arr.concat(); //arr.splice();
  }
  return null;
}

//数组 深拷贝,不能拷子孙函数的数组或对象
function DeepCopy(arr) {
  return JSON.parse(JSON.stringify(arr));
}

//数组 深拷贝 递归
function DeepCopy2(arr) {
  if(typeof arr !== 'object') {
    return;
  }
  let newObj = type(arr) === 'array' ? [] : {};
  for(let l in arr) {
    if(arr.hasOwnProperty(l)) {
      newObj[l] = typeof arr[l] === 'object'? DeepCopy2(arr[l]) : arr[l];
    }
  }
  return newObj;
}

//extend 实现 浅拷贝
function extend() {
  let length = arguments.length;
  let target = arguments[0];

  for(let i = 1 ; i< length ;i++) {
    for(let k in arguments[i]) {
      target[k] = arguments[i][k];
    }
  }
  return target;
}

//extend 实现 深拷贝
function extend2() {
  let deep = false;
  let target = arguments[0];
  let targetIndex = 0;
  if(typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    targetIndex = 1;
  }

  if(typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  for(let i = targetIndex+1; i < arguments.length-1 ;i++) {
    let options = arguments[i];
    for(let k in options) {
      let tg = target[k];
      let copy = options[k];
      //deep extend 如果某一个copy值指向target会一直递归循环不断试图extend
      if(copy == target) {
        continue;
      }
      if(deep && copy && (isPlainObject(copy) || (Array.isArray(copy)))) {
        if(Array.isArray(copy)) {
          tg = Array.isArray(tg) || [];
        }else{
          tg = isPlainObject(tg) || {};
        }
        options[k] = extend2(deep,tg,copy);
      }else {
        target[k] = options[k];
      }
    }
  }
  return target;
}

//数组扁平化处理，一层扁平化（更实用，多个数组的并集，交集，过滤等），深度扁平化

function flatten(input,shallow,filter,output) {

  output = output || [];
  let idx = output.length;

  //是否数组
  for(let i = 0 ; i <input.length ; i++) {
    let value = input[i];
    if(Array.isArray(value)){
      if(shallow) {
        let j = 0;
        let len = value.length;
        while(j < len) {
          output[idx++] = value[j++];
        }
      }else {
        flatten(value,shallow,filter,output);
        idx = output.length;

      }
    }else if(!filter) {
      output[idx++] = input[i];
    }
  }

  return output;
}


//数组扁平化，一层扁平化，并去重，求并集
function union(arr) {
  let output = flatten(arr,true,true);
  return Array.from(new Set(output));
}

//数组扁平化，一层扁平化，并去重，求交集
function difference(target,arr) {
  let output = flatten(arr,true,true);
  return target.filter((a)=>output.indexOf(a) > -1);
}

function sortedIndex(arr,obj) {
  let left = 0;
  let right = arr.length;
  while(left < right) {
    let mid = Math.floor((right + left) / 2);
    if(arr[mid] < obj ) {
      //right
      left = mid+1;
    }else{
      //left
      right = mid;
    }
  }
  return right;
}