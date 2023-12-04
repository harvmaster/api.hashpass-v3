interface CreateUserRequest {
  username: string
  password: string
}

interface CreateUserResponse {
  user: {
    username: string
    settings: {
      algorithm: string
    }
    create_date: Date
  },
  refresh_token: string;
  access_token: string;
}

interface LoginUserRequest {
  username: string
  password: string
}

interface LoginUserResponse {
  user: {
    username: string
    settings: {
      algorithm: string
    }
    create_date: Date
  },
  refresh_token: string;
  access_token: string;
}

interface RefreshTokenRequest {
  refresh_token: string
}

interface RefreshTokenResponse {
  access_token: string
}

interface GetUserResponse {
  user: {
    username: string
    settings: {
      algorithm: string
    }
    create_date: Date
  }
}

interface CreateServiceRequest {
  name: string
  logo: string
  notes?: {
    username?: string
    email?: string
    other?: string
  },
  algorithm: string
}

interface CreateServiceResponse {
  service: {
    name: string
    logo: string
    notes: {
      username: string
      email: string
      other: string
    }
    status: {
      timesUsed: number
      lastUsed: number
    }
    algorithm: string
    create_date: Date
  }
}

interface DeleteServiceRequest {
  id: string
}

interface DeleteServiceResponse {
  status: string;
}

interface GetServiceRequest {
  id: string
}

interface GetServiceResponse {
  service: {
    name: string
    logo: string
    notes: {
      username: string
      email: string
      other: string
    }
    algorithm: string
    create_date: Date
  }
}

interface UpdateServiceRequest {
  id: string
  name: string
  logo: string
  notes: {
    username: string
    email: string
    other: string
  }
  algorithm: string
}

interface UpdateServiceResponse {
  service: Service
}

interface ErrorResponse {
  error?: string | { [key: string]: string }
}

// Dynamic union that takes an interface and returns a union of it or the ErrorResponse
type APIResponse<T> = T | ErrorResponse