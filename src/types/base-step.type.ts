export type BaseStepType = {
  handleNext: () => void,
  onMain: () => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isLoading: boolean
}