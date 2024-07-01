import { Button, Form, Steps } from "antd";
import { useState } from "react";
import React from "react";
import MessageConfig from "./component/MessageConfig";

export const ContentPoster = () => {
  const [form] = Form.useForm();

  const [step, setStep] = useState<number>(0);

  return (
    <div style={{ width: "95vw", padding: 10 }}>
      <Steps
        current={step}
        size={"small"}
        items={[
          {
            title: "URL",
          },
          {
            title: "AI content",
          },
          {
            title: "Edit",
          },
        ]}
      />
      {step === 0 && <MessageConfig form={form} />}
      {/* {step === 1 && <MessageEditor form={form} />} */}
      {/* {step === 2 && <PostConfig form={form} content={form.getFieldValue("content")} />} */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {step > 0 ? (
          <Button
            onClick={() => {
              setStep(step - 1);
            }}
          >
            Back
          </Button>
        ) : undefined}
        <Button
          type={"primary"}
          onClick={() => {
            setStep(step + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
