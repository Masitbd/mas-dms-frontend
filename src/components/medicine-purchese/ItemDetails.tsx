import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Form,
  Grid,
  Row,
  Col,
  Input,
  DatePicker,
  SelectPicker,
  InputNumber,
  Button,
} from "rsuite";
import { Rfield as Field } from "../ui/Rfield";
import { Package, Calendar, DollarSign, Percent, Edit } from "lucide-react";

export interface ItemDetailData {
  category: string;
  medicineName: string;
  quantity: number;
  purchaseRate: number;
  salesRate: number;
  dateExpire: Date;
  dateMfg: Date;
  vat: number;
  discount: number;
}

export interface PurchaseDetailItem extends ItemDetailData {
  id: string;
  amount: number;
  balance: number;
  posted: string;
}

interface ItemDetailsFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<PurchaseDetailItem, "id">) => void;
  onEdit?: (id: string, item: Omit<PurchaseDetailItem, "id">) => void;
  editItem?: PurchaseDetailItem | null;
}

const categoryOptions = [
  { label: "CAPSULE", value: "CAPSULE" },
  { label: "Tablet", value: "Tablet" },
  { label: "Capsule", value: "Capsule" },
  { label: "Syrup", value: "Syrup" },
  { label: "Injection", value: "Injection" },
];

const medicineOptions = [
  { label: "Denvar 200", value: "Denvar 200" },
  { label: "Sergel 20", value: "Sergel 20" },
  { label: "Skilor 500", value: "Skilor 500" },
  { label: "Bonviv", value: "Bonviv" },
  { label: "Napyn 500", value: "Napyn 500" },
  { label: "Abacal 5/20", value: "Abacal 5/20" },
  { label: "CLONATHIL 0.5", value: "CLONATHIL 0.5" },
  { label: "ROCIPRO 500", value: "ROCIPRO 500" },
  { label: "Plenal-cs", value: "Plenal-cs" },
  { label: "Lexoril 3mg Tab", value: "Lexoril 3mg Tab" },
];

export const ItemDetailsForm: React.FC<ItemDetailsFormProps> = ({
  open,
  onClose,
  onAdd,
  onEdit,
  editItem,
}) => {
  const isEditMode = !!editItem;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ItemDetailData>({
    defaultValues: {
      category: "",
      medicineName: "",
      quantity: 0,
      purchaseRate: 0,
      salesRate: 0,
      dateExpire: new Date(),
      dateMfg: new Date(),
      vat: 0,
      discount: 0,
    },
  });

  // Reset form when editItem changes
  React.useEffect(() => {
    if (editItem) {
      reset({
        category: editItem.category,
        medicineName: editItem.medicineName,
        quantity: editItem.quantity,
        purchaseRate: editItem.purchaseRate,
        salesRate: editItem.salesRate,
        dateExpire: new Date(editItem.dateExpire),
        dateMfg: new Date(editItem.dateMfg),
        vat: editItem.vat,
        discount: editItem.discount,
      });
    } else {
      reset({
        category: "",
        medicineName: "",
        quantity: 0,
        purchaseRate: 0,
        salesRate: 0,
        dateExpire: new Date(),
        dateMfg: new Date(),
        vat: 0,
        discount: 0,
      });
    }
  }, [editItem, reset]);

  const watchedValues = watch(["quantity", "purchaseRate", "vat", "discount"]);

  const onSubmit = (data: ItemDetailData) => {
    const baseAmount = data.quantity * data.purchaseRate;
    const vatAmount = (baseAmount * data.vat) / 100;
    const discountAmount = (baseAmount * data.discount) / 100;
    const amount = baseAmount + vatAmount - discountAmount;

    const itemData: Omit<PurchaseDetailItem, "id"> = {
      ...data,
      amount: Number(amount.toFixed(2)),
      balance: Number(amount.toFixed(2)),
      posted: "Posted",
    };

    if (isEditMode && editItem && onEdit) {
      onEdit(editItem.id, itemData);
    } else {
      onAdd(itemData);
    }

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Edit className="w-5 h-5 text-orange-600" />
              Edit Item Details
            </>
          ) : (
            <>
              <Package className="w-5 h-5 text-blue-600" />
              Add Item Details
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid fluid>
            <Row gutter={16} className="mb-4">
              <Col xs={12}>
                <Form.ControlLabel className="font-medium text-gray-700 mb-2">
                  Category
                </Form.ControlLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Field
                      as={SelectPicker}
                      field={field}
                      error={errors.category?.message}
                      data={categoryOptions}
                      placeholder="Select category"
                      block
                      searchable={false}
                    />
                  )}
                />
              </Col>

              <Col xs={12}>
                <Form.ControlLabel className="font-medium text-gray-700 mb-2">
                  Medicine Name
                </Form.ControlLabel>
                <Controller
                  name="medicineName"
                  control={control}
                  rules={{ required: "Medicine name is required" }}
                  render={({ field }) => (
                    <Field
                      as={SelectPicker}
                      field={field}
                      error={errors.medicineName?.message}
                      data={medicineOptions}
                      placeholder="Select medicine"
                      block
                      searchable
                    />
                  )}
                />
              </Col>
            </Row>

            <Row gutter={16} className="mb-4">
              <Col xs={8}>
                <Form.ControlLabel className="font-medium text-gray-700 mb-2">
                  Quantity
                </Form.ControlLabel>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" },
                  }}
                  render={({ field }) => (
                    <Field
                      as={InputNumber}
                      field={field}
                      error={errors.quantity?.message}
                      placeholder="0"
                      min={1}
                    />
                  )}
                />
              </Col>

              <Col xs={8}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Purchase Rate
                </Form.ControlLabel>
                <Controller
                  name="purchaseRate"
                  control={control}
                  rules={{
                    required: "Purchase rate is required",
                    min: { value: 0.01, message: "Rate must be positive" },
                  }}
                  render={({ field }) => (
                    <Field
                      as={InputNumber}
                      field={field}
                      error={errors.purchaseRate?.message}
                      placeholder="0.00"
                      prefix="৳"
                      step={0.01}
                    />
                  )}
                />
              </Col>

              <Col xs={8}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Sales Rate
                </Form.ControlLabel>
                <Controller
                  name="salesRate"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Rate must be positive" },
                  }}
                  render={({ field }) => (
                    <Field
                      as={InputNumber}
                      field={field}
                      error={errors.salesRate?.message}
                      placeholder="0.00"
                      prefix="৳"
                      step={0.01}
                    />
                  )}
                />
              </Col>
            </Row>

            <Row gutter={16} className="mb-4">
              <Col xs={12}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Manufacturing Date
                </Form.ControlLabel>
                <Controller
                  name="dateMfg"
                  control={control}
                  rules={{ required: "Manufacturing date is required" }}
                  render={({ field }) => (
                    <Field
                      as={DatePicker}
                      field={field}
                      error={errors.dateMfg?.message}
                      placeholder="Select date"
                      format="dd-MMM-yyyy"
                      block
                    />
                  )}
                />
              </Col>

              <Col xs={12}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Expiry Date
                </Form.ControlLabel>
                <Controller
                  name="dateExpire"
                  control={control}
                  rules={{ required: "Expiry date is required" }}
                  render={({ field }) => (
                    <Field
                      as={DatePicker}
                      field={field}
                      error={errors.dateExpire?.message}
                      placeholder="Select date"
                      format="dd-MMM-yyyy"
                      block
                    />
                  )}
                />
              </Col>
            </Row>

            <Row gutter={16} className="mb-4">
              <Col xs={12}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4" />
                  VAT (%)
                </Form.ControlLabel>
                <Controller
                  name="vat"
                  control={control}
                  render={({ field }) => (
                    <Field
                      as={InputNumber}
                      field={field}
                      error={errors.vat?.message}
                      placeholder="0"
                      suffix="%"
                      step={0.01}
                      max={100}
                      min={0}
                    />
                  )}
                />
              </Col>

              <Col xs={12}>
                <Form.ControlLabel className="flex items-center gap-1 font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4" />
                  Discount (%)
                </Form.ControlLabel>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => (
                    <Field
                      as={InputNumber}
                      field={field}
                      error={errors.discount?.message}
                      placeholder="0"
                      suffix="%"
                      step={0.01}
                      max={100}
                      min={0}
                    />
                  )}
                />
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          appearance="primary"
          className={
            isEditMode
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        >
          {isEditMode ? "Update Item" : "Add Item"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
