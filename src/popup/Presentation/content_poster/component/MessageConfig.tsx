import { Cascader, Form, FormInstance, Input, Select } from "antd";
import React from "react";


const { TextArea } = Input;

interface MessageConfigProps {
  form: FormInstance,
}

const contentOptions = [
  {
    label: "TL;DR summary",
    value: "summary",
    children: [{
      value: "url",
      label: "URL",
    }, {
      value: "content",
      label: "Content",
    }]
  },
  { label: "Pros/cons", value: "pros_cons" },
  { label: "Explain like i'm five", value: "ELI5" },
  { label: "Tweet", value: "tweet" },
]

const styleOptions = [
  { label: "British Lingo", value: "British Lingo" },
  { label: "Casey Newton", value: "Casey Newton" },
  { label: "Gen Z Lingo", value: "Gen Z Lingo" },
  { label: "John Stewart", value: "John Stewart" },
  { label: "Maya Angelou", value: "Maya Angelou" },
  { label: "Nilay Patel", value: "Nilay Patel" },
  { label: "Ricky Gervais", value: "Ricky Gervais" },
  { label: "Snoop", value: "Snoop" },
]

const MessageConfig = ({ form }: MessageConfigProps) => {
  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        style={{ overflow: "auto" }}
      >
        <Form.Item
          label={"Content action"}
          name={"action"}
          initialValue={["summary", "url"]}
        >
          <Cascader
            options={contentOptions}
            allowClear={false}
            onChange={(value) => {
              // const message = genMessage(value[0].toString(), form.getFieldValue("style"))
              // form.setFieldValue("message", message)
            }}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
        >
          {({ getFieldValue }) =>
            (getFieldValue("action") && getFieldValue("action")[1] === "url") ?
              <Form.Item
                label={"Add your URL"}
                name={"messageContent"}
                rules={[
                  {
                    required: true,
                    message: "Please input url you want"
                  },
                  {
                    type: "url",
                    message: "This field must be a valid url."
                  }
                ]}
              >
                <Input />
              </Form.Item> :
              <Form.Item
                label={"Add your content"}
                name={"messageContent"}
                rules={[
                  {
                    required: true,
                    message: "Please input content you want"
                  },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
          }
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
        >
          {({ getFieldValue }) =>
            (getFieldValue("action")[0] === "tweet" || getFieldValue("action")[0] === "summary") &&
            <Form.Item
              label={"Tone/style of"}
              name={"style"}
              initialValue={"British Lingo"}>
              <Select
                options={styleOptions}
                onSelect={(value) => {
                  // const message = genMessage(getFieldValue("action")[0], value)
                  // form.setFieldValue("message", message)
                }}
              />
            </Form.Item>
          }
        </Form.Item>
        <Form.Item
          label={"Message for GPT"}
          name={"message"}
          rules={[{
            required: true,
            message: "Message can not be empty"
          }]}
        // initialValue={genMessage("summary", "British Lingo")}
        >
          <TextArea
            showCount
            rows={5}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default MessageConfig