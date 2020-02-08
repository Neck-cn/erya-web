const Router = require('vue-router');

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/framework',
      name: 'FrameWork',
      component: resolve => require(['@/components/FrameWork'], resolve),
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: '/answer',
          name: 'Answer',
          component: resolve => require(['@/components/Answer'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/answerTemp',
          name: 'AnswerTemp',
          component: resolve => require(['@/components/AnswerTemp'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/appError',
          name: 'appError',
          component: resolve => require(['@/components/AppError'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/course',
          name: 'course',
          component: resolve => require(['@/components/Course'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/problem',
          name: 'problem',
          component: resolve => require(['@/components/Problem'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/serverError',
          name: 'serverError',
          component: resolve => require(['@/components/ServerError'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/spider',
          name: 'spider',
          component: resolve => require(['@/components/Spider'], resolve),
          meta: {
            keepAlive: true
          }
        }, {
          path: '/course/detail',
          name: 'courseDetail',
          component: resolve => require(['@/components/CourseDetail'], resolve),
          // meta: {
          //   keepAlive: true
          // }
        }, {
          path: '/course/edit',
          name: 'EditCourse',
          component: resolve => require(['@/components/EditCourse'], resolve),
          // meta: {
          //   keepAlive: true
          // }
        }, {
          path: '/user',
          name: 'user',
          component: resolve => require(['@/components/User'], resolve),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/Login'], resolve),
      meta: {
        keepAlive: true
      }
    }
  ]
})
