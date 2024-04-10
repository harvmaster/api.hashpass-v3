import mongoose, { Document, Model, Schema, Types, InferSchemaType, HydratedDocument } from 'mongoose'

type SchemaInput = InferSchemaType<typeof schema>
type SchemaProps = InferSchemaType<typeof schema> & { id: string, create_date: Date }

type SchemaMethods = {
  toJSONData(): LogoProps
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
    fileType: {
      type: String,
      required: true
    }
  },
  archived: {
    type: Boolean,
    required: false,
    default: false
  },
  create_date: {
    type: Date,
    required: false,
    default: Date.now,
  }
})

schema.methods.toJSONData = function (): LogoProps {
  const { 
    domain,
    original_url,
    size,
    redirect,
    file,
    archived,
    create_date, 
    id
  } = this.toObject() as SchemaProps;

  return  { domain, original_url, size, redirect, file, archived, create_date, id }
}

const Logo = mongoose.model<SchemaProps, SchemaModel>('logo', schema)

export type LogoInput = SchemaInput
export type LogoProps = SchemaProps
export type LogoMethods = SchemaMethods
export type LogoStatics = SchemaStatics
export type LogoDocument = HydratedDocument<SchemaProps, SchemaMethods>

export default Logo;
