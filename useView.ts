import { GoBackData, Pagination } from "@/interface/base"
import { Column } from "@/interface/table"
import { ref, watch } from "vue"
import { useRoute } from 'vue-router'
import router from '@/router'
import { getQueryVariable } from "@/utils/utils"

interface useBeforeStruct {
  pagination?: Pagination
  searchData?: {
    [key: string]: any
  }
  sorter?: {
    [key: string]: number
  }
}

/**
 * useBeforeView
 * 处理开始之前的逻辑
 * 例如：获取数据
 */
export const useBeforeView = (setPage?: (page: number, size?: number) => void) => {
  const route = useRoute()
  const initSearchData = ref()
  let backData: GoBackData
  watch(() => route.query, (query) => {
    if (query.initData) {
      backData = JSON.parse(query.initData as any)
      if (backData.pagination) {
        if (setPage) {
          setPage(backData.pagination.current ?? 1, backData.pagination.pageSize ?? 1)
        }
      }
      if (backData.searchData) {
        initSearchData.value = JSON.parse(JSON.stringify(backData.searchData))
      }
    }
  }, { immediate: true })

  /** 设置默认排序 */
  const setDefaultSortOrder = (columns: Array<Column>) => {
    if (columns.length > 0 && backData?.sorter) {
      for (const key in backData.sorter) {
        if (Object.prototype.hasOwnProperty.call(backData.sorter, key)) {
          let index = columns.findIndex((item) => item.dataIndex === key)
          if (index > -1) {
            columns[index].defaultSortOrder = backData.sorter[key] === 1 ? 'descend' : 'ascend'
          }
        }
      }
    }
  }

  return {
    initSearchData,
    setDefaultSortOrder
  }
}

/** 删除url参数 */
export const useRemUrlParams = () => {
  const currentUrl = window.location.href;
  if (getQueryVariable("initData") && currentUrl.split("?")) {
    window.location.href = currentUrl.split("?")[0];
  }
}