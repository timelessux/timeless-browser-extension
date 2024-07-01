import { DatePicker, DatePickerProps, FormInstance, Select, Space } from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'

type PickerType = 'now' | 'schedule'

interface Props {
  value?: DatePickerProps['value']
  onChange?: () => void
  form: FormInstance
}

function ScheduleOptions({ value, onChange, form }: Props) {
  const [type, setType] = useState<PickerType>('now')

  useEffect(() => {
    if (type == 'now' && form) form.setFieldValue('schedule', undefined)
  }, [type])

  return (
    <Space>
      <Select value={type} onChange={setType} style={{ width: 150 }}>
        <Select.Option value="now">Now</Select.Option>
        <Select.Option value="schedule">Schedule</Select.Option>
      </Select>
      {type == 'schedule' && <DatePicker value={value} showTime onChange={onChange} />}
    </Space>
  )
}

export default ScheduleOptions
