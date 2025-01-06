class ApiRes {
    constructor(statusCode,massage="Success",data){
     this.statusCode=statusCode;
     this.massage=massage;
     this.data= data;
    }

}
export {ApiRes}