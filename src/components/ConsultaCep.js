import React from 'react';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogActions, 
  DialogContent,
  DialogContentText,
  DialogTitle

} from '@material-ui/core';

const validationSchema = yup.object({
  cep: yup
    .string('Insira o cep')
    .min(8, "O cep deve ter exatamente 8 digitos")
    .max(8, "O cep deve ter exatamente 8 digitos")
    .required('O cep é obrigatório'),

  logradouro: yup
    .string('Insira o logradouro')
    .required('O logradouro é obbrigatorio'),

  numero: yup
    .string('Insira o numero')
    .required('O numero é obrigatório'),

  bairro: yup
    .string('Insira o bairro')
    .required('O bairro é obrigatório'),

  complemento: yup
    .string('Insira o complemento')
    .required('O complemento é obrigatório'),

  cidade: yup
    .string('Insira o cidade')
    .required('O cidade é obrigatório'),

});


function ConsultaCep() {

  const paperStyle = { padding: '4vh 2vh', width: '70vw', margin: '3vh auto' };
  const textStyle = { margin: '1vh 0' }
  const btn = { padding: '2vh 0' }

  const [open, setOpen] = React.useState(false);
  const [tituloDialog, setTituloDialog] = React.useState(false);
  const [textoDialog, setTextoDialog] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  function onCepChange(ev) {
    const { value } = ev.target;

    const cep = value?.replace(/[^0-9]/g, '');

    if (cep?.length !== 8) {
      formik.resetForm();
      formik.setFieldValue("cep", cep);
      return
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.erro != "undefined") {
          formik.resetForm();
          setTituloDialog('Erro!')
          setTextoDialog("O CEP informado não existe.")
          setOpen(true);
        } else {
          formik.setFieldValue('logradouro', data.logradouro);
          formik.setFieldValue('bairro', data.bairro);
          formik.setFieldValue('complemento', data.complemento);
          formik.setFieldValue('cidade', data.localidade);
        }
      });
  }

  const formik = useFormik({
    initialValues: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
    },

    validationSchema: validationSchema,

    onSubmit: (values) => {

      const dados_string = JSON.stringify(values, null, 2)
      setTituloDialog("Sucesso!")
      setTextoDialog(`Dados enviados ao servidor back-end: \n${dados_string}`)
      setOpen(true);

      formik.resetForm();
    },
  });

  console.log(formik.handleChange);

  return (
    <Grid>
      <Paper elevation={5} style={paperStyle} >
        <Grid align="center">
          <Typography variant='h4'>Bem vindo, faça seu cadastro!</Typography>
        </Grid>
        <Formik>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              style={textStyle}
              fullWidth
              id="cep"
              label="Cep"
              name="cep"
              variant="outlined"
              value={formik.values.cep}
              onChange={(ev) => { formik.handleChange(ev); onCepChange(ev) }}
              error={formik.touched.cep && Boolean(formik.errors.cep)}
              helperText={formik.touched.cep && formik.errors.cep}
            />

            <TextField
              style={textStyle}
              fullWidth
              id="logradouro"
              label="Logradouro"
              name="logradouro"
              variant="outlined"
              value={formik.values.logradouro}
              onChange={formik.handleChange}
              error={formik.touched.logradouro && Boolean(formik.errors.logradouro)}
              helperText={formik.touched.logradouro && formik.errors.logradouro}
            />

            <TextField
              style={textStyle}
              fullWidth
              id="numero"
              label="Numero"
              name="numero"
              variant="outlined"
              value={formik.values.numero}
              onChange={formik.handleChange}
              error={formik.touched.numero && Boolean(formik.errors.numero)}
              helperText={formik.touched.numero && formik.errors.numero}
            />

            <TextField
              style={textStyle}
              fullWidth
              id="complemento"
              label="Complemento"
              name="complemento"
              variant="outlined"
              value={formik.values.complemento}
              onChange={formik.handleChange}
              error={formik.touched.complemento && Boolean(formik.errors.complemento)}
              helperText={formik.touched.complemento && formik.errors.complemento}
            />

            <TextField
              style={textStyle}
              fullWidth
              id="bairro"
              label="Bairro"
              name="bairro"
              variant="outlined"
              value={formik.values.bairro}
              onChange={formik.handleChange}
              error={formik.touched.bairro && Boolean(formik.errors.bairro)}
              helperText={formik.touched.bairro && formik.errors.bairro}
            />

            <TextField
              fullWidth
              style={textStyle}
              id="cidade"
              label="Cidade"
              name="cidade"
              variant="outlined"
              value={formik.values.cidade}
              onChange={formik.handleChange}
              error={formik.touched.cidade && Boolean(formik.errors.cidade)}
              helperText={formik.touched.cidade && formik.errors.cidade}
            />

            <Button fullWidth style={btn} color="primary" variant="contained" type="submit">
              Enviar
            </Button>
          </form>
        </Formik>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{tituloDialog}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{whiteSpace: "pre"}}>
            {textoDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ConsultaCep;