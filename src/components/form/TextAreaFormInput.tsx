import type { FormInputProps } from '@/types/component-props';
import { ChangeEvent } from 'react'; // Adicione esta importação
import { FormControl, FormGroup, type FormControlProps } from 'react-bootstrap';
import Feedback from 'react-bootstrap/esm/Feedback';
import { Controller, type FieldPath, type FieldValues, type PathValue } from 'react-hook-form';

type TextAreaFormInputProps = { 
  rows?: number
  value?: any
  onChange?: (e: ChangeEvent<HTMLTextAreaElement> | string) => void // Modificado aqui
}

const TextAreaFormInput = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  rows = 3,
  containerClassName,
  control,
  id,
  label,
  noValidate,
  value: externalValue,
  onChange: externalOnChange,
  ...other
}: FormInputProps<TFieldValues> & FormControlProps & TextAreaFormInputProps) => {
  // Se não houver control, renderiza como componente não controlado pelo react-hook-form
  if (!control) {
    const displayValue = Array.isArray(externalValue) 
      ? externalValue.map(item => typeof item === 'object' ? item.name : item).join('; ') 
      : externalValue

    return (
      <FormGroup className={containerClassName ?? ''}>
        {/*{label && <FormLabel>{label}</FormLabel>}*/}
        <FormControl
          id={id}
          rows={rows}
          as="textarea"
          {...other}
          value={displayValue || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            if (externalOnChange) {
              // Permite tanto o evento quanto o valor direto
              externalOnChange(e.target.value)
            }
          }}
        />
      </FormGroup>
    )
  }

  // Se houver control, renderiza como componente controlado pelo react-hook-form
  return (
    <Controller<TFieldValues, TName>
      name={name as TName}
      defaultValue={'' as PathValue<TFieldValues, TName>}
      control={control}
      render={({ field, fieldState }) => {
        const displayValue = Array.isArray(field.value) 
          ? field.value.map(item => typeof item === 'object' ? item.name : item).join('; ') 
          : field.value

        return (
          <FormGroup className={containerClassName ?? ''}>
            {/*{label && <FormLabel>{label}</FormLabel>}*/}
            <FormControl 
              id={id} 
              rows={rows} 
              as="textarea" 
              {...other} 
              value={displayValue || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                field.onChange(e.target.value)
                if (externalOnChange) {
                  externalOnChange(e.target.value)
                }
              }}
              isInvalid={Boolean(fieldState.error?.message)} 
            />
            {!noValidate && fieldState.error?.message && <Feedback type="invalid">{fieldState.error?.message}</Feedback>}
          </FormGroup>
        )
      }}
    />
  )
}

export default TextAreaFormInput