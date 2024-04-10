import mongoose, { Document, Model, Schema, Types, InferSchemaType, HydratedDocument } from 'mongoose'

type SchemaInput = InferSchemaType<typeof schema>
type SchemaProps = InferSchemaType<typeof schema> & { id: string, create_date: Date }

type SchemaMethods = {
  toJSONData(): logoProps
}
type SchemaStatics = {
  // createlogo(logo: SchemaProps): Promise<SchemaDocument<SchemaMethods>>
}

type SchemaDocument<T> = Document<Types.ObjectId, T, SchemaProps>
type SchemaModel = Model<SchemaProps, {}, SchemaMethods> & SchemaStatics

const schema = new Schema({
  domain: {
    type: String,
    required: true
  },
  original_url: {
    type: String,
    required: true
  },
  size: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  redirect: {
    type: Boolean,
    required: true
  },
  file: {
    data: {
      type: Buffer,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  create_date: {
    type: Date,
    required: false,
    default: Date.now,
  }
})

schema.methods.toJSONData = function (): logoProps {
  const { 
    domain,
    original_url,
    size,
    redirect,
    file,
    create_date, 
    id
  } = this.toObject() as SchemaProps;

  return  { domain, original_url, size, redirect, file, create_date, id }
}

const logo = mongoose.model<SchemaProps, SchemaModel>('logo', schema)

export type logoInput = SchemaInput
export type logoProps = SchemaProps
export type logoMethods = SchemaMethods
export type logoStatics = SchemaStatics
export type logoDocument = HydratedDocument<SchemaProps, SchemaMethods>

export default logo;
