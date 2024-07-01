import { Select } from 'antd'
import React from 'react'
import { TimelessProfile } from '../../Domain/Repository/InternalProfileRepository'

interface ProfileValue {
  id?: string | null
  address?: string | null
  handle?: string | null
}

interface Props {
  data: Array<TimelessProfile>
  value?: ProfileValue
  onChange?: (value: ProfileValue) => void
}

const ChooseProfile = ({ data, onChange, value, ...field }: Props) => {
  const triggerChange = (changedValue: string) => {
    const profile = data.find((item) => item.id === changedValue)
    if (profile)
      onChange?.({
        id: profile.id,
        address: profile.owner_address,
        handle: profile.handle
      })
  }

  return (
    <Select
      {...field}
      placeholder="Select profile to post"
      value={value?.handle}
      onChange={triggerChange}
      options={data.map((profile) => ({
        value: profile.id,
        label: profile.handle
      }))}
    />
  )
}

export default ChooseProfile
