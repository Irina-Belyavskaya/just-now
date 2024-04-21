import React from "react";
import SignUpNicknameScreen from "../components/SignUpNicknameScreen";
import { BaseStepType } from "../types/base-step.type";
import SignUpEmailAndPasswordScreen from "../components/SignUpEmailAndPasswordScreen";
import SignUpUploadPhotoScreen from "../components/SignUpUploadPhotoScreen";

interface Step {
  title: string;
  content: (props: BaseStepType) => JSX.Element;
}

const steps: Step[] = [
  {
    title: 'Please write your nickname',
    content: (props: BaseStepType) => <SignUpNicknameScreen {...props} />,
  },
  {
    title: 'Please write your email and password',
    content: (props: BaseStepType) => <SignUpEmailAndPasswordScreen {...props} />,
  },
  {
    title: 'Upload your photo',
    content: (props: BaseStepType) => <SignUpUploadPhotoScreen {...props} />,
  },
];

export default steps;