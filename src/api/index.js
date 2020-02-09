/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:4000'
const BASE_URL = 'https://api.erya.ychstudy.cn'

// 1、用户名密码登陆
export const reqPwdLogin = ({username, password,time}) =>{return ajax(`${BASE_URL}/auth/auth/login`,{username,password,time},'POST')};
// 2、获取答案列表
export const reqAnswerList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/answer/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
// 3、删除答案
export const reqAnswerDelete = (list) =>{return ajax(`${BASE_URL}/admin/answer/delete`,list,'POST')};
// 4、修改答案
export const reqAnswerModify = (answer) =>{return ajax(`${BASE_URL}/admin/answer/modify`,answer,'POST')};
// 5、添加答案
export const reqAnswerAdd = (answer) =>{return ajax(`${BASE_URL}/admin/answer/add`,answer,'POST')};
// 6、获取临时表列表
export const reqAnswerTempList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/answerTemp/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
// 7、删除临时表某条数据
export const reqAnswerTempDelete = (list) =>{return ajax(`${BASE_URL}/admin/answerTemp/delete`,list,'POST')};
// 8、修改临时表数据
export const reqAnswerTempModify = (answer) =>{return ajax(`${BASE_URL}/admin/answerTemp/modify`,answer,'POST')};
// 9、删除临时表数据
export const reqAnswerTempmergeAll = () =>{return ajax(`${BASE_URL}/admin/answerTemp/mergeAll`,{},'POST')};
// 10、合并所选数据
export const reqAnswerTempmerge = (list) =>{return ajax(`${BASE_URL}/admin/answerTemp/merge`,list,'POST')};
// 11、去重数据
export const reqAnswerTempremoval = () =>{return ajax(`${BASE_URL}/admin/answerTemp/removal`,{},'POST')};
//12、清除数据
export const reqAppErrorclear = () =>{return ajax(`${BASE_URL}/admin/appErr/appError/clear`,{},'POST')};
// 13、删除数据
export const reqdeleteAppError = (list) =>{return ajax(`${BASE_URL}/admin/appErr/deleteAppError`,list,'POST')};
// 14、获取getAppError
export const reqAppError = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/appErr/getAppError/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
// 15、获取课程
export const reqCourse = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/course/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
// 16、删除课程列表
export const reqCourselistdelete = (list) =>{return ajax(`${BASE_URL}/admin/course/delete`,list,'POST')};
// 17、清除所有问题数据
export const reqProblemclear = () =>{return ajax(`${BASE_URL}/admin/problem/clear`,{},'POST')};
//18、删除问题数据
export const reqdeleteProblem = (list) =>{return ajax(`${BASE_URL}/admin/problem/deleteProblem`,list,'POST')};
//19、获取问题列表
export const reqProblemList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/problem/getProblem/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
// 20、清除所有服务错误数据
export const reqServerErrorclear = () =>{return ajax(`${BASE_URL}/admin/serverErr/serverError/clear`,{},'POST')};
//21、删除服务数据
export const reqdeleteServerError = (list) =>{return ajax(`${BASE_URL}/admin/serverErr/deleteServerError`,list,'POST')};
//22、获取服务数据列表
export const reqServerErrorList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/serverErr/getServerError/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};

//23、获取爬虫数据列表
export const reqspiderList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/spider/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
//24、合并所有爬虫数据
export const reqspidermergeAll = () =>{return ajax(`${BASE_URL}/admin/spider/mergeAll`,{},'POST')};
//25、合并爬虫数据
export const reqspidermerge= (list) =>{return ajax(`${BASE_URL}/admin/spider/merge`,list,'POST')};
//27、删除爬虫数据
export const reqspiderdelete = (list) =>{return ajax(`${BASE_URL}/admin/spider/delete`,list,'POST')};
//28、修改爬虫数据
export const reqspidermodify = (Spider) =>{return ajax(`${BASE_URL}/admin/spider/modify`,Spider,'POST')};
//29、开始爬虫
export const reqstartSpider = (thread,sleep,{url}) =>{return ajax(`${BASE_URL}/admin/startSpider/${thread}/${sleep}`,{url},'POST',  'application/x-www-form-urlencoded')};

//30、修改某个用户
export const reqUsermodifynum = (num,{list}) =>{return ajax(`${BASE_URL}/admin/user/modify/${num}`,list,'POST',  'application/x-www-form-urlencoded')};
//31、修改新老用户
export const reqUsermodifyoldnew = (old,news) =>{return ajax(`${BASE_URL}/admin/user/modify/${old}/${news}`,{},'POST',  'application/x-www-form-urlencoded')};
//32、获取用户
export const reqUserList = (currentPage,pageSize,{search}) =>{return ajax(`${BASE_URL}/admin/user/${currentPage}/${pageSize}`,{search},'POST',  'application/x-www-form-urlencoded')};
//33、修改某个所有
export const reqUsermodifyAllnum = (num) =>{return ajax(`${BASE_URL}/admin/user/modifyAll/${num}`,{},'POST',  'application/x-www-form-urlencoded')};
//34、修改用户
export const reqUsermodify= ({user}) =>{return ajax(`${BASE_URL}/admin/user/modify`,user,'POST',  'application/x-www-form-urlencoded')};
//35、获取通知
export const reqgetNotice= () =>{return ajax(`${BASE_URL}/admin/notice/getNotice`,{},'POST')};
//36、获取客户端状态
export const reqgetDeploy= () =>{return ajax(`${BASE_URL}/admin/notice/getDeploy`,{},'POST')};
//37、设置通知
export const reqsetNotice= (notice) =>{return ajax(`${BASE_URL}/admin/notice/setNotice`,{notice},'POST',  'application/x-www-form-urlencoded')};
//38、设置客户端状态
export const reqsetDeploy= (deploy) =>{return ajax(`${BASE_URL}/admin/notice/setDeploy`,{deploy},'POST',  'application/x-www-form-urlencoded')};
//39、获取课程详情
export const reqgetCoursedetail=(id) =>{return ajax(`${BASE_URL}/admin/course/getCourse/${id}`,{},'POST',  'application/x-www-form-urlencoded')};
//40、修改课程详情
export const reqCoursemodify=(course) =>{return ajax(`${BASE_URL}/admin/course/modify`,course,'POST')};





