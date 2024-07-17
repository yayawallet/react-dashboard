import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAxios } from '../../api/axios';

const Invitation = () => {
  const [invitationID, setInvitationID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [phoneNumberLookup, setPhoneNumberLookup] = useState('');

  const handlePhoneNumberLookup = (number: string) => {
    if (number.length < 9) return;

    if (number.startsWith('0') && number.length < 10) return;
    if ((number.startsWith('7') || number.startsWith('9')) && number.length < 9) return;
    if (number.startsWith('+2510') && number.length < 14) return;
    if (number.startsWith('+251') && number.length < 13) return;

    setPhoneNumberLookup('');

    authAxios.post('/user/search', { query: number }).then((res) => {
      if (res.data.length > 0) setPhoneNumberLookup('User already exists');
    });
  };

  const formik = useFormik({
    initialValues: {
      phone: '',
      amount: 0,
      country: 'Ethiopia',
    },

    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .matches(
          /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^9\d{8}$)/, // Ethiopian phone number
          'phone number is not valid'
        )
        .required('phone number is required'),
      amount: Yup.number().min(0, 'cannot be less than 0'),
    }),

    onSubmit: (values) => {},
  });

  return <div>Invitation</div>;
};

export default Invitation;
