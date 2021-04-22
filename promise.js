export function Promise(fn) {
    this.fulfilledQueues = []
    this.rejectedQueues = []
    this.state = 'pending'
    try{
        fn(this.resolve, this.reject)
    } catch(e) {
        this.catchFn && this.catchFn(e)
    }
}
Promise.prototype.resolve = (val) => {
    if(this.state != 'pending') 
        return;
    this.state = 'FULFILLED'
    const runFulfilled = (value) => {
        let cb;
        while(cb = this.fulfilledQueues.shift()) {
            cb(value)
        }
    }
    const runRejected = (value) => {
        let cb;
        while(cb = this.rejectedQueues.shift()) {
            cb(value)
        }
    }
    if(val instanceof Promise) {
        val.then((res) => {
            runFulfilled(res)
        }, (error) => {
            runRejected(error)
        })
    } else {
        runFulfilled(val)
    }

    
}
Promise.prototype.reject = (err) => {

}
Promise.prototype.then = (successFn, failFn) => {
    return new Promise((resolve, reject) => {

        let fulfilled = value => {
            if (!isFunction(successFn)) {
                resolve(successFn)
            } else {
                let res = successFn(value);
                if (successFn instanceof Promise) {
                    res.then(resolve, reject)
                } else {
                    resolve(res)
                }
            }
        }

        let rejected = error => {
            if (!isFunction(failFn)) {
                reject(failFn)
            } else {
                let res = reject(value);
                if (reject instanceof Promise) {
                    res.then(resolve, reject)
                } else {
                    resolve(res)
                }
            }
        }
        switch (this.state) {
            case 'pending' :
                this.fulfilledQueues.push(successFn)
                this.rejectedQueues.push(failFn)
                break;
            case 'fulfilled':
                fulfilled()
                break;
            case 'rejected':
                rejected()
                break;
        }
    })
    

    // if (this.successFn) {
    //     this.successFn = successFn(this.successFn)
    // } else {
    //     this.successFn = successFn
    // }

    return this
}
Promise.prototype.catch = (errorFn) => {
    this.catchFn = errorFn
}

// test 
export function test() {
    let promise = new Promise((resolve, reject)=> {
        // todo 
        resolve('11111')

        // todo 
        reject()
    }).then((res)=>{
        return new Promise((resolve,reject) => {
            // todo 
            resolve('222')

            // todo 
            reject()
        })
        console.log(res)
    }).then((res)=>{
        console.log(res)
    }).catch((error) => {
        console.log(error)
    })
}