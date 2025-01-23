/*
 * @Description: 列表
 * @Version: 1.0
 */
import { computed, ref, Ref } from 'vue'
import { TablePaginationConfig } from 'ant-design-vue';
import { DefaultRecordType } from 'ant-design-vue/lib/vc-table/interface';

export const useTablePagination = (changeCallBack?: Function, initPageSize = 10, _pagination = { showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '40'], }) => {
  const current = ref(1)
  const total = ref(0)
  const pageSize = ref(initPageSize)
  const filters = ref()
  const sorter = ref<any>({})
  const extra = ref()
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    showTotal: (total: number) => `总共 ${total} 条数据`,
    pageSizeOptions: _pagination.pageSizeOptions,
    showSizeChanger: _pagination.showSizeChanger,
    onShowSizeChange: (_, _pageSize) => (pageSize.value = _pageSize)
  }));

  const handleTableChange = (
    pag: TablePaginationConfig,
    filters: any,
    _sorter: any,
    extra: any
  ) => {
    current.value = pag.current as number;
    filters.value = filters;
    sorter.value = {}
    if (Array.isArray(_sorter)) {
      _sorter.map(v => {
        sorter.value[v.field] = v.order ? v.order == 'ascend' ? 1 : -1 : undefined;
      })
    } else {
      sorter.value[_sorter.field] = _sorter.order ? _sorter.order == 'ascend' ? 1 : -1 : undefined;
    }
    extra.value = extra;
    if (changeCallBack) {
      changeCallBack()
    }
  }

  /** 设置 */
  const setPage = (page: number, size?: number) => {
    current.value = page;
    if (size) {
      pageSize.value = size;
    }
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
    /** 翻页事件 */
    handleTableChange,
    /** 筛选条件 */
    filters,
    /** 排序条件 */
    sorter,
    /** 额外参数 */
    extra,
    setPage
  }
}

export const useRowSelection = <T extends object = DefaultRecordType>(key?: string) => {
  let selectedRowKeys: Ref<Array<string | number>> = ref([]);
  let selectedRows: Ref<Array<T>> = ref([]);
  let changeRows: Ref<Array<T>> = ref([]);
  let selfData: Ref<T | undefined> = ref()
  let selected: Ref<boolean> = ref(false)
  let selectAllChecked: Ref<boolean> = ref(false)
  let selectedAllRows: Ref<Array<T>> = ref([]);

  const setCheckedKeys = (keys: Array<string | number>) => {
    selectedRowKeys.value = keys
  }

  const rowSelection = computed(() => {
    return {
      selectedRowKeys,
      onChange: (keys: (string | number)[], rows: Array<T>) => {
        selectedRowKeys.value = keys
        selectedRows.value = JSON.parse(JSON.stringify(rows))
        selectedRows.value.map(v => {
          Object.assign(v, {
            rowSelectionKey: key
          })
        })
      },
      onSelect: (_record: T, _selected: boolean) => {
        selfData.value = _record
        selected.value = _selected
        Object.assign(selfData.value, {
          checked: _selected
        })
      },
      onSelectAll: (_selected: boolean, rows: Array<T>, changeRow: Array<T>) => {
        selectAllChecked.value = _selected
        selectedAllRows.value = changeRow
      },
    }
  });

  return {
    /** 可多选模式 */
    rowSelection,
    /** 获取已选择得key */
    getSelectedRowKeys: selectedRowKeys,
    /** 获取已选择得数据 */
    getSelectedRows: selectedRows,
    /** 获取选择得数据 */
    getChangeRows: changeRows,
    getSelectRecord: selfData,
    getSelected: selected,
    getSelectAllChecked: selectAllChecked,
    getSelectedAllRows: selectedAllRows,
    /** 设置已选keys */
    setCheckedKeys
  }
}
