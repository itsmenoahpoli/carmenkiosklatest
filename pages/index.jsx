import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Image,
  Form,
  FloatingLabel,
  Button,
  Card,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

import axios from "axios";
import Swal from "sweetalert2";

const LandingPage = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (formData) => {
    const devURL = "http://localhost:8000/api/v1";
    const prodURL = "https://sisig-barn-app.pwnp-ws.com/public/api/v1";

    const axiosBaseURL = prodURL;

    await axios
      .post(`${axiosBaseURL}/auth/login`, formData)
      .then((response) => {
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);

        router.push("/app/dashboard");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid credentials provided",
          confirmButtonText: "Okay",
        });
      });
  };

  React.useEffect(() => {
    if (
      localStorage.getItem("user") !== null &&
      localStorage.getItem("accessToken") !== null
    ) {
      router.replace("/app/dashboard");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Carmen Resto - Log In</title>
      </Head>
      <Container
        fluid
        className="auth-container d-flex justify-content-center align-items-center"
      >
        <Card className="col-md-3 col-sm-8 col-xs-10">
          <Card.Body>
            <div className="text-center">
              <Image
                fluid
                src="/assets/images/brand-logo.jpg"
                alt="carmens bulalo"
                height={130}
                width={130}
              />
            </div>

            <Form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
              <small className="text-muted">
                Please enter your credentials below &mdash;
              </small>

              <Form.Group className="form-group">
                <FloatingLabel label="E-mail">
                  <Form.Control
                    type="email"
                    className={
                      Boolean(errors && errors.email?.type === "required")
                        ? "border border-danger"
                        : ""
                    }
                    {...register("email", { required: true })}
                    placeholder="E-mail"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="form-group">
                <FloatingLabel label="Password">
                  <Form.Control
                    type="password"
                    className={
                      Boolean(errors && errors.password?.type === "required")
                        ? "border border-danger"
                        : ""
                    }
                    {...register("password", { required: true })}
                    placeholder="Password"
                  />
                </FloatingLabel>
              </Form.Group>

              <Button type="submit" className="w-100">
                SUBMIT
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default LandingPage;
