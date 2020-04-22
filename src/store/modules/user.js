import { login, getInfo, getRoleList, getCaptcha } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, setUserName, setDepartmentName, setDepartmentId, setRoleId, setRefreshToken, setExpirationTime } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '../index'

const state = {
  token: getToken(),
  user_id: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: []

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verCode: verCode }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setRefreshToken(data.refreshToken)
        setToken(data.token)
        setUserId(data.id) // 设置userid
        setUserName(data.trueName)
        setDepartmentName(data.departmentName)
        setDepartmentId(data.departmentId)

        // 设置过期时间
        const Nowdata = new Date().getTime() + (data.tokenExpire * 1000) // 当前日期时间戳-服务器时间戳得到间隔时间
        setExpirationTime(Nowdata)
        // setNowdata(new Date().getTime()) //设置当前时间戳
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get Captcha
  getCaptcha({ commit }, userName) {
    return new Promise((resolve, reject) => {
      getCaptcha(userName).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }, roleId) {
    return new Promise((resolve, reject) => {
      getInfo(roleId).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录。')
        }

        const { roles, user_id, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_USERID', user_id)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get getRoleList
  getRoleList({ commit }) {
    return new Promise((resolve, reject) => {
      getRoleList().then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // save avatar
  saveAvatar({ commit }, avatar) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatar)
      resolve()
    })
  },

  // save token
  saveToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      // const token = role + '-token'
      setRoleId(role)
      // commit('SET_TOKEN', token)
      // `setToken(token)
      const { routers } = await dispatch('getInfo', role)
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await store.dispatch('permission/generateRoutes', { routers })
      await store.dispatch('permission/getRorls', role) // 按钮用例
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)
      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
