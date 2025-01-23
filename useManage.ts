/*
 * @Description: 管理页面业务
 * @Version: 1.0
 */
import { nextTick, Ref, ref } from 'vue'
import dayjs from 'dayjs';
import { useTablePagination } from './useTable'
import { useRoute, useRouter } from 'vue-router'
import { GoBackData } from '@/interface/base';

/** 操作指令 */
export enum OperateCMD {
  /** 编辑 */
  edit,
  /** 新增 */
  new,
  /** 详情 */
  details,
  /** 查看列表 */
  showList
}

interface ManageOption {
  /** 查询方法 */
  doQuery: Function
}

export const useManage = (doQuery?: Function) => {
  const { total, pagination, handleTableChange, current, pageSize, sorter, setPage } = useTablePagination(doQuery)
  const searchData: Ref<any> = ref({})
  const route = useRoute()
  const router = useRouter()

  const onSearch = (param: any) => {
    current.value = 1
    if (param && param.queryTime && param.queryTime.length > 1) {
      Object.assign(param, {
        startTime: dayjs(param.queryTime[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: dayjs(param.queryTime[1]).format('YYYY-MM-DD 23:59:59'),
      })

      delete param.queryTime
    }

    searchData.value = param ?? {}
    if (doQuery) {
      doQuery()
    }
  }

  const visible = ref(false)
  const formData = ref()
  const command = ref(OperateCMD.showList)
  /** 
   * 操作方法
   */
  const operateFn = (record: any, cmd: OperateCMD) => {
    visible.value = true
    command.value = cmd
    formData.value = record ?? {}
  }


  /** 返回 */
  const goBack = (isQuery = false) => {
    if (route.query?.backData) {
      let backData: GoBackData = JSON.parse(route.query.backData as any)
      if (backData.url) {
        router.push({
          path: backData.url,
          query: {
            initData: JSON.stringify(backData)
          }
        })
      }
      return
    }
    visible.value = false
    formData.value = {}
    command.value = OperateCMD.showList

    const query: any = { ...route.query }
    delete query.command
    delete query.id
    router.replace({
      query
    }).finally(() => {
      if (isQuery && doQuery) {
        doQuery()
      }
    })
  }

  return {
    /** 当前页数 */
    current,
    /** 每页大小 */
    pageSize,
    /** 总数 */
    total,
    /** 分页配置 */
    pagination,
    /** 条件搜索数据 */
    searchData,
    /** 可视的 配合`operateFn` 使用 */
    visible,
    /** 当前`operateFn` 选择的记录 */
    formData,
    /** 当前操作指令 */
    command,
    /** 返回事件 */
    goBack,
    /** 翻页事件 */
    handleTableChange,
    /** 条件搜索功能 */
    onSearch,
    /** 操作事件 */
    operateFn,
    sorter,
    setPage,
    router,
    route
  }
}
