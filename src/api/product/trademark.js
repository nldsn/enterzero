import request from '@/utils/request';

// 获取品牌列表 GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ method: 'GET', url: `/admin/product/baseTrademark/${page}/${limit}` });

// 新增、修改品牌 POST /admin/product/baseTrademark/save PUT /admin/product/baseTrademark/update
export const reqAddOrUpdateTrademark = (data) => {
  if (data.id) {
    return request({ method: 'PUT', url: '/admin/product/baseTrademark/update',data});
  } else {
    return request({ method: 'POST', url: '/admin/product/baseTrademark/save',data });
  }
};

// 删除品牌 /admin/product/baseTrademark/remove/{id}
export const deleteTrademark = (id) => request({ method: 'DELETE', url: `/admin/product/baseTrademark/remove/${id}`})
