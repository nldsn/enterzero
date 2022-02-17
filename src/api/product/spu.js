import request from '@/utils/request'; // 相当于前面我们封装的ajax

const api_name = '/admin/product';
/*
    获取所有的spu销售属性列表
    GET /admin/product/baseSaleAttrList
    */
export const getSaleAttrList = () => {
  return request.get(`${api_name}/baseSaleAttrList`);
};

/*
    删除指定的SPU
    DELETE /admin/product/deleteSpu/{spuId}
    */
export const remove = (spuId) => {
  return request.delete(`${api_name}/deleteSpu/${spuId}`);
};

/*
    根据id获取SPU信息
    GET /admin/product/getSpuById/{spuId}
    spuList: 包含多个spu简单信息的数组
    spuInfo: 包含一个spu详细信息的对象
    */
export const get = (spuId) => {
  return request.get(`${api_name}/getSpuById/${spuId}`);
};

/*
    添加SPU详情信息
    POST /admin/product/saveSpuInfo
    POST /admin/product/updateSpuInfo
    */
export const addUpdate = (spuInfo) => {
  // return request.post(`${api_name}/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
  return request({
    url: `${api_name}/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
    method: 'POST',
    data: spuInfo,
  });
};

/*
    获取SPU的分页列表数据
    GET /admin/product/{page}/{limit}
    query参数: category3Id
    */
export const getList = (page, limit, category3Id) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'GET',
    params: { category3Id },
  });
};

export const findSpuInfoByKeyword = (keyword) => {
  return request({
    url: `${api_name}/findSpuInfoByKeyword/${keyword}`,
    method: 'get',
  });
};
