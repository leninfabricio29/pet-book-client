import React, { useState } from 'react';
import Select, { ActionMeta } from 'react-select';


const colourOptions = [
    { value: 'Blanco', label: 'Blanco', isFixed: false },
    { value: 'Negro', label: 'Negro', isFixed: false },
    { value: 'Gris', label: 'Gris', isFixed: false },
    { value: 'Chocolate', label: 'Chocolate', isFixed: false },
    { value: 'Dorado', label: 'Dorado', isFixed: false },
    { value: 'Perla', label: 'Perla', isFixed: false },
    { value: 'Negro y blanco', label: 'Blanco y negro', isFixed: false },


    // Puedes  más opciones aquí según sea necesario
  ];

const styles = {

    
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'danger' } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
};

const orderOptions = (values) => {
  return values
    .filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

export default  () => {
  const [value, setValue] = useState(
    orderOptions([])
  );

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = colourOptions.filter((v) => v.isFixed);
        break;
    }

    setValue(orderOptions(newValue));
  };

  return (
    <Select
      value={value}
      isMulti
      styles={styles}
      isClearable={value.some((v) => !v.isFixed)}
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange}
      options={colourOptions}
    />
  );
};
