import React from 'react';
import {NHFormItem, NHStuSelector} from 'xgui-for-react';
import {Form, Input, message} from 'antd';
import css from './index.less';
import moment from "moment/moment";

class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMount() {
        const {isEdit, editData} = this.props
    }

    initProps = (id,
                 label,
                 required = true,
                 initialValue = null,
                 labelCol = 8,
                 wrapperCol = 12,
                 isTime = false,
                 timeFormat = 'YYYY-MM-DD HH:mm:ss') => {
        const {form, editData, isEdit} = this.props
        return {
            form: form,
            id: id,
            label: label,
            required: required,
            formItemLayout: {labelCol: {span: labelCol}, wrapperCol: {span: wrapperCol}},
            initialValue: isEdit
                ? isTime ? moment(editData[id], timeFormat) : editData[id]
                : initialValue
        }
    }

    render() {
        const {} = this.state
        const {form, isEdit} = this.props
        const {setFieldsValue, getFieldValue} = form

        return (
            <div className={css.removeBottom}>
                <Form formItemLayout={{wrapperCol: {span: 24}}}>

                    <div>
                        <NHTeaSelector ref={ref => this.teaSelector = ref}
                                       sign={'zhxg_selector_jsxx'}
                                       isSinger={true}
                                       isRememberLastSelect
                                       onSelect={(selectRowKeys, selectRows) => {
                                           if (selectRows.length === 0) {
                                               message.warn('请选择老师再点击保存！')
                                               return
                                           }

                                           let teacher = selectRows[0]
                                           setFieldsValue({jsid: teacher.JSID, xm: teacher.XM})
                                       }}/>

                        <NHStuSelector ref={ref => this.studentSelector = ref}
                                       sign={'zhxg_selector_xsxx'}
                                       isSinger={true}
                                       isRememberLastSelect
                                       onSelect={(selectRowKeys, selectRows) => {
                                           if (selectRows.length === 0) {
                                               message.warn('请选择学生再点击保存！')
                                               return
                                           }

                                           let student = selectRows[0]
                                           setFieldsValue({xsid: student.XSID, xm: student.XM})
                                       }}/>
                    </div>

                    <div style={{display: 'none'}}>
                        <NHFormItem {...this.initProps('pkid', '主键', false)}><Input readOnly/></NHFormItem>
                        <NHFormItem {...this.initProps('jsid', '教师id')}><Input readOnly/></NHFormItem>
                        <NHFormItem {...this.initProps('xsid', 'xsid')}><Input readOnly/></NHFormItem>
                    </div>

                    <NHFormItem {...this.initProps('jsxm', '导师')}>
                        <Input onClick={() => this.teaSelector.show()} readOnly disabled={isEdit} placeholder={'选择老师'} style={{width: '100%'}} />
                    </NHFormItem>

                    <NHFormItem {...this.initProps('xsxm', '学生')}>
                        <Input onClick={() => this.studentSelector.show()} readOnly disabled={isEdit} placeholder={'选择学生'} style={{width: '100%'}} />
                    </NHFormItem>




                </Form>
            </div>
        )
    }
}

export default Form.create()(EditInitForm);
