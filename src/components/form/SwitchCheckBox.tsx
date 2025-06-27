import { useEffect, useState } from 'react';
import { FormCheck, FormCheckProps } from 'react-bootstrap';

export interface SwitchProps extends Omit<FormCheckProps, 'type' | 'onChange'> {
  initialValue?: boolean;
  onChange?: (checked: boolean) => void;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'lg' | 'default';
}

const SwitchCheckBox = ({
  initialValue = false,
  onChange,
  label,
  labelPosition = 'right',
  size = 'default',
  className = '',
  ...props
}: SwitchProps) => {
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    onChange?.(isChecked);
  };

  const sizeClass = size === 'sm' ? 'form-switch-sm' : size === 'lg' ? 'form-switch-lg' : '';

  return (
    <div className={`d-flex align-items-center ${className}`}>
      {label && labelPosition === 'left' && (
        <span className="me-2">{label}</span>
      )}
      <FormCheck
        type="switch"
        checked={checked}
        onChange={handleChange}
        label={labelPosition === 'right' ? label : undefined}
        className={sizeClass}
        {...props}
      />
    </div>
  );
};

export default SwitchCheckBox;