import React from "react";
import {
  Button,
  Form,
  FloatingLabel,
  Row,
  Col,
  Image
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProductCategoriesService } from "lib/services";

const productCategoriesService = new ProductCategoriesService();

export const ProductForm = (props) => {
  const { formFns, values } = props;
  const uploadInputRef = React.useRef(null)
  const [imagePreview, setImagePreview] = React.useState("")
  const [image, setImage] = React.useState(null);
  const [priceErr, setPriceErr] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("")

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (formValues) => {
    delete formValues?.product_category
    delete formValues?.image_url
    
    await formFns.formSubmitFn({ ...formValues, image });
  };

  const handleImagePreview = image => {
    if (image) {
      const previewURL = URL.createObjectURL(image);
      setImagePreview(previewURL);
      setImage(image)
    }
  }

  const handleResetImage = () => {
    setImagePreview("")
    setImage(null)

    uploadInputRef.current.value = ""
  }

  const validatePrice = price => {
    if (price === 0 || price < 0) {
      setPriceErr(true)
      return;
    }

    setPriceErr(false)
  }

  const getCategories = async () => {
    await productCategoriesService.getAll("").then(response => {
      setCategories(response.data)
    })
  }

  React.useEffect(() => {
    getCategories();

    reset({...values, product_category_id: values?.product_category_id ?? ""})

    if (values && values.product_category_id) {
      setSelectedCategory(Number(values.product_category_id))
    }
  }, [])

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {Boolean(!values?.id) && <Form.Group className="form-group">
        <Row>
          <Col md={5}>
            <Form.Label>Image</Form.Label>
              <Form.Control
              type="file"
              placeholder="Menu Item Image"
              ref={uploadInputRef}
              onChange={e => handleImagePreview(e.target.files[0])}
            />
            {Boolean(image !== null) && <Button onClick={handleResetImage} variant="link" size="sm">Remove image</Button>}  
          </Col>

          <Col md={7}>
            <div className="col-md-10 mx-auto" style={{height: '300px', padding: '10px', borderRadius: '10px', border: 'solid 1px #eee', backgroundColor: '#f1f1f1'}}>
              {Boolean(image !== null) && <Image src={imagePreview} alt="" style={{height: '100%', width: '100%'}} fluid />}
              {Boolean(values?.image_url) && <Image src={values?.image_url} alt="" style={{height: '100%', width: '100%'}} fluid /> }
            </div>
          </Col>
        </Row>
      </Form.Group>}
      <Form.Group className="form-group">
        <FloatingLabel label="Category">
          <Form.Select
            type="text"
            className={
              Boolean(errors && errors.product_category_id?.type === "required")
                ? "border border-danger"
                : ""
            }
            {...register("product_category_id", { required: true })}
            value={selectedCategory}
            placeholder="Category"
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Choose</option>
            {categories.map(c => <option value={c.id} key={`category-${c.name}`}>{c.name}</option>)}
          </Form.Select>
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Name">
          <Form.Control
            type="text"
            className={
              Boolean(errors && errors.name?.type === "required")
                ? "border border-danger"
                : ""
            }
            {...register("name", { required: true })}
            defaultValue={values?.name}
            placeholder="Name"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Price">
          <Form.Control
            type="number"
            min="0"
            className={
              Boolean(errors && errors.price?.type === "required")
                ? "border border-danger"
                : ""
            }
            {...register("price", {  required: true, })}
            onChange={e => validatePrice(Number(e.target.value))}
            defaultValue={values?.price}
            placeholder="Price"
          />

          {Boolean(priceErr) && <small className="text-danger">Price must be above zero</small>}
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Description">
          <Form.Control
            type="text"
            className={
              Boolean(errors && errors.description?.type === "required")
                ? "border border-danger"
                : ""
            }
            {...register("description", { required: true })}
            defaultValue={values?.description}
            placeholder="Description"
            as="textarea"
            style={{ height: "140px" }}
          />
        </FloatingLabel>
      </Form.Group>

      <Button type="submit" disabled={priceErr ? true : false}>SUBMIT PRODUCT DETAILS</Button>
    </Form>
  );
};
