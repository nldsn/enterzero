import request from '@/utils/request';

export const login = (data) => request({ url: '/admin/acl/index/login', method: 'post', data });

export const getInfo = (token) => request({ url: '/admin/acl/index/info', method: 'get', params: { token } });

export const logout = () => request({ url: '/admin/acl/index/logout', method: 'post' });

// 获取
