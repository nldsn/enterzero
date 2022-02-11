import request from '@/utils/request'; 
// 获取商品一级分类 /admin/product/getCategory1
export const reqCategory1 = () => request({url: `/admin/product/getCategory1`,method: 'GET'})
// 获取商品二级分类 GET /admin/product/get/category2/{id}
export const reqCategory2 = (category1Id) => request({url: `/admin/product/getCategory2/${category1Id}`,method: 'GET'})
// 获取商品三级分类 GET /admin/product/get/category3/{id}
export const reqCategory3 = (category2Id) => request({url: `/admin/product/getCategory3/${category2Id}`,method: 'GET'})
// 获取商品属性列表 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})
