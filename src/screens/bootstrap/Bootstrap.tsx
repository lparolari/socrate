import React, { useContext, useState } from "react";
import { Switch, withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { ThresholdContext } from "../../providers/threshold";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";

export const Bootstrap = () => {
  const { setThreshold } = useContext(ThresholdContext);

  const [tempThreshold, setTempThresold] = useState(20);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempThresold(Number.parseInt(e.target.value));
  };

  const handleClick = () => {
    setThreshold(tempThreshold);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Typography variant="h1">
            Benvenuto in <b>Socrate</b>
          </Typography>
          <Typography variant="h5">Real Time Social Management</Typography>
        </div>
        <div className="col" style={{ marginTop: 20 }}>
          <Paper style={{ padding: 16 }}>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">Iniziamo</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Socrate (acronimo fantasioso di Real Time Social Management) è
                  un semplice tool con lo scopo di aiutare a tenere traccia
                  degli affollamenti in seguito alle disposizioni per il
                  COVID-19 in vigore dal 18 maggio 2020. In particolare, è
                  previsto che i gestori delle strutture tengano traccia
                  dell'affollamento. Socrate permette di gestire in tempo reale
                  e avere <b>sotto controllo</b> il numero di ospiti in una
                  struttura.
                </Typography>
                <Typography style={{ marginTop: 10 }}>
                  Il tool vuole essere uno strumento <b>semplice</b>,{" "}
                  <b>temporaneo</b> e <b>gratuito</b> disponibile a tutti finchè
                  la fase di transizione non sarà conclusa.
                </Typography>
                <Typography style={{ marginTop: 10 }}>
                  Per continuare è necessario configurare una{" "}
                  <b>soglia massima</b> di ospiti che la tua struttura può
                  contenere, in questo modo il sistema può aiutarti nel gestire
                  il carico di affluenza.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Soglia"
                  type="number"
                  variant="outlined"
                  value={tempThreshold}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleClick}
                >
                  Continua
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
      <footer style={{ marginTop: 30 }}>
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <p>
                Build with love by <b>Luca Parolari</b> &nbsp; &copy; 2020{" "}
                <br />
                and hosted by{" "}
                <a href="https://www.nexioinformatica.com/">
                  Nexio Informatica SRL
                </a>
                .
                <br />
                <br />
                Email:{" "}
                <a href="mailto:luca.parolari23@gmail.com">
                  luca.parolari23@gmail.com
                </a>
                <br />
                GitHub: <a href="https://github.com/lparolari">@lparolari</a>
                <br />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
