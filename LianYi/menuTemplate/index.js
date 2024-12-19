import React from 'react'
import {Button, getSize, hasAuth, NHConfirm, NHContainerFrame, NHExcel, NHFetch, NHTable} from 'xgui-for-react'
import {message, Modal} from 'antd'
import css from './index.less'
import AddForm from "./addOrUpdateForm"
import StudentList from "./studentList/studentList"
import LeaveList from "./leaveList/leaveList"

const pageBaseUrl = `${window.baseUrl}/mentorManagement`
const moduleName = `导师名单`
const pageCommonAuthPrefix = 'ly-sm-xgdw_mentorManagement'

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            frameVisibleMap: {
                tableFrame: true
            },
            modalVisibleMap: {
                addOrUpdateModal: false
            },
            loadingMap: {
                confirmLoading: false
            },
            record: {}
        }
    }

    /**
     * 设置显示页面，如果不传入参数，则默认显示初始表格页
     * @param showFlagName
     */
    setCurrentFrame = (showFlagName = 'tableFrame') => {
        let frameVisibleMap = this.state.frameVisibleMap
        for (let name in frameVisibleMap) {
            frameVisibleMap[name] = name === showFlagName
        }
        this.setState(frameVisibleMap)
    }
    /**
     * 设置显示的模态窗口，如果不传入参数，则默认不显示任何一个模态窗口
     * @param showModalName 模态窗口名称
     */
    setCurrentModal = showModalName => {
        let modalVisibleMap = this.state.modalVisibleMap
        for (let name in modalVisibleMap) {
            modalVisibleMap[name] = name === showModalName
        }
        this.setState(modalVisibleMap)
    }
    /**
     * 切换loading状态
     * @param loadName loading名称
     */
    reverseLoadingStatus = loadName => {
        let loadingMap = this.state.loadingMap
        loadingMap[loadName] = !loadingMap[loadName]
        this.setState(loadingMap)
    }

    // 回到页面初始状态
    backInitialPageState = () => {
        this.setState({record: {}})
        this.setCurrentModal()
        this.setCurrentFrame()
    }
    backOriginAndRefresh = () => {
        this.backInitialPageState()
        this.nhTable.filterTableData()
    }

    handleDelete = record => {
        NHConfirm('是否确定删除？', () => {
            this.deleteBatch([record.PKID])
        }, 'warn')
    }

    // 批量删除
    handleDeleteBatch = () => {
        const selectedRowKeys = this.nhTable.state.selectedRowKeys
        if (!selectedRowKeys || selectedRowKeys.length <= 0) {
            message.error("请选择要删除的记录！")
            return
        }

        NHConfirm('是否确定删除已选择的记录？', () => {
            this.deleteBatch(selectedRowKeys)
        }, 'warn')
    }

    deleteBatch = pkidList => {
        NHFetch(`${pageBaseUrl}/multiDelete`, 'POST', pkidList)
            .then(res => {
                if (res && res.code === 200) {
                    message.success('删除成功！')
                    this.nhTable.filterTableData()
                }
            })
    }

    // 适配modal
    add = () => {
        this.reverseLoadingStatus('confirmLoading')
        this.addOrUpdateRef.validateFields((err, formData) => {
            if (err) {
                this.reverseLoadingStatus('confirmLoading')
                return
            }

            let url
            let msg
            if (!formData.pkid) {
                url = 'insert'
                msg = '新增成功！'
            } else {
                url = 'update'
                msg = '修改成功！'
            }

            NHFetch(`${pageBaseUrl}/${url}`, 'POST', formData)
                .then(res => {
                    if (res && res.code === 200) {
                        message.success(msg)
                        this.backInitialPageState()
                    }
                    this.reverseLoadingStatus('confirmLoading')
                })
        })
    }

    // 适配NHFra
    addOrUpdate = stopLoading => {
        this.addOrUpdateRef.validateFields((err, formData) => {
            if (err) {
                stopLoading && stopLoading()
                return
            }
            let url
            let msg
            if (!formData.pkid) {
                url = 'insert'
                msg = '新增成功！'
            } else {
                url = 'update'
                msg = '修改成功！'
            }
            NHFetch(`${pageBaseUrl}/${url}`, 'POST', formData)
                .then(res => {
                    if (res && res.code === 200) {
                        message.success(msg)
                        this.backOriginAndRefreshTable()
                    }
                    stopLoading && stopLoading()
                })
                .catch(err => stopLoading && stopLoading())
        })
    }

    lowerize = obj => {
        let newObj = {}
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key.toLowerCase()] = obj[key]
            }
        }
        return newObj
    }

    render() {
        const {frameVisibleMap, modalVisibleMap, loadingMap, record} = this.state
        const {tableFrame, addOrUpdateFrame, leaveListFrame, studentListFrame} = frameVisibleMap
        const {addOrUpdateModal} = modalVisibleMap
        const {confirmLoading} = loadingMap

        const columns = [
            {title: '序号', dataIndex: 'ROW_ID', width: '50px'},
            {title: '姓名', dataIndex: 'XM', width: '120px', searchType: 'input'},
            {title: '教工号', dataIndex: 'GH', width: '120px', searchType: 'input'},
            {title: '上任时间', dataIndex: 'RZKSSJMC', width: '120px'}
        ]

        const action = [
            {
                title: '修改',
                onClick: record => {
                    this.setState({record}, () => this.setCurrentModal('addOrUpdateModal'))
                },
                isShow: record => {
                    return true
                },
                auth: `${pageCommonAuthPrefix}_update`
            },
            {
                title: '删除',
                onClick: record => {
                    this.handleDelete(record)
                },
                isShow: record => {
                    return true
                },
                auth: `${pageCommonAuthPrefix}_delete`
            }
        ]

        return (
            <div className={css.main_right_content} style={{height: getSize().contentH - 24}}>
                <div className={css.table} style={{display: tableFrame ? 'block' : 'none'}}>
                    <NHTable
                        ref={ref => this.nhTable = ref}
                        rowKey={record => record.PKID}
                        sign='zhxg_xgdw_ds_zrmd'
                        columns={columns}
                        action={action}
                        actionLength={3} // 针对操作列，超过3项时，其他项都会显示在“更多”
                    >
                        {
                            hasAuth(`${pageCommonAuthPrefix}_insert`) &&
                            <Button type='primary' style={{marginRight: 10}} onClick={e => this.setCurrentModal('addOrUpdateModal')}>新增</Button>
                        }
                        {
                            hasAuth(`${pageCommonAuthPrefix}_import`) &&
                            <Button type='default' style={{marginRight: 10}} onClick={e => this.importExcel.show()}>导入</Button>
                        }
                        {
                            hasAuth(`${pageCommonAuthPrefix}_export`) &&
                            <Button type='default' style={{marginRight: 10}} onClick={e => this.nhTable.exportExcel(moduleName)}>导出</Button>
                        }
                        {
                            hasAuth(`${pageCommonAuthPrefix}_delete`) &&
                            <Button type='danger' style={{marginRight: 10}} onClick={e => this.handleBatchResign()}>批量删除</Button>
                        }
                        {
                            hasAuth(`${pageCommonAuthPrefix}_resignationList`) &&
                            <Button type='default' style={{marginRight: 10}} onClick={e => this.setCurrentFrame('leaveListFrame')}>离任名单</Button>
                        }
                    </NHTable>
                </div>

                {/* 导入窗口 */}
                <NHExcel title={`${moduleName}导入`}
                    ref={ref => this.importExcel = ref}
                    templateName={`${moduleName}导入模板`}
                    templateSign={`${moduleName}导入模板`}
                    importUrl={`${pageBaseUrl}/import`}
                    params={{}}
                    onSuccess={() => this.nhTable.filterTableData()}
                    description={['正确的数据会先被导入，错误数据将在完成后提供下载']}
                />

                <Modal title={'新增'} visible={addOrUpdateModal} confirmLoading={confirmLoading} centered destroyOnClose
                        onOk={this.add}
                        onCancel={this.backInitialPageState}>
                    <AddForm ref={ref => this.addOrUpdateRef = ref} pageBaseUrl={pageBaseUrl} editData={this.lowerize(record)}
                             isEdit={Object.keys(record).length !== 0}/>
                </Modal>

                <NHContainerFrame title={`学生名单`} visible={studentListFrame}
                                    onOk={null}
                                    onCancel={this.backInitialPageState}>
                    <StudentList pageBaseUrl={pageBaseUrl} tutor={this.lowerize(record)}/>
                </NHContainerFrame>

                <NHContainerFrame title={`离任名单`} visible={leaveListFrame}
                                    onOk={null}
                                    onCancel={this.backInitialPageState}>
                    <LeaveList pageBaseUrl={pageBaseUrl}/>
                </NHContainerFrame>

                <NHContainerFrame title={`修改`} visible={addOrUpdateFrame}
                                  onOk={this.addOrUpdate}
                                  onCancel={this.backInitialPageState}>
                    <AddForm ref={ref => this.addOrUpdateRef = ref} pageBaseUrl={pageBaseUrl} editData={this.lowerize(record)}
                             isEdit={Object.keys(record).length !== 0}/>
                </NHContainerFrame>
            </div>
        )
    }
}

export default Index
