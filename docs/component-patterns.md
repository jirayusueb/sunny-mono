# Component Patterns Documentation

This document outlines the component patterns used throughout the project to maintain consistency, reusability, and maintainability in the React frontend.

## Overview

The project follows a structured approach to component organization with clear patterns for different types of components:

- **UI Components** - Reusable, presentational components
- **Feature Components** - Business logic components
- **Container Components** - State management and data fetching
- **Layout Components** - Page structure and navigation

## Component Hierarchy

```
App
├── Layout Components
│   ├── Root Layout
│   ├── Page Layout
│   └── Navigation
├── Container Components
│   ├── Feature Containers
│   └── Page Containers
├── Feature Components
│   ├── Business Logic
│   └── Data Processing
└── UI Components
    ├── Base Components
    ├── Composite Components
    └── Form Components
```

## UI Component Patterns

### Base Component Structure
```typescript
// components/ui/button.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
```

### Key Patterns
1. **forwardRef**: Proper ref forwarding for DOM elements
2. **Polymorphic Components**: Support for different element types
3. **Variant System**: Consistent styling through variants
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Accessibility**: Built-in accessibility features

### Composite Component Pattern
```typescript
// components/ui/card.tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
```

## Container Component Patterns

### Container Structure
```typescript
// containers/feature-name/feature-name.container.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FeatureComponent } from "./components/feature-component";
import { useFeatureLogic } from "./hooks/use-feature-logic";

interface FeatureContainerProps {
  userId: string;
  onSuccess?: () => void;
}

export function FeatureContainer({ userId, onSuccess }: FeatureContainerProps) {
  const [localState, setLocalState] = useState<FeatureState>(initialState);

  const { data, isLoading, error } = useQuery({
    queryKey: ['feature', userId],
    queryFn: () => fetchFeatureData(userId),
  });

  const mutation = useMutation({
    mutationFn: updateFeatureData,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const featureLogic = useFeatureLogic({
    data,
    onUpdate: mutation.mutate,
  });

  if (isLoading) {
    return <FeatureSkeleton />;
  }

  if (error) {
    return <FeatureError error={error} />;
  }

  return (
    <div className="feature-container">
      <FeatureComponent
        data={data}
        state={localState}
        onStateChange={setLocalState}
        onAction={featureLogic.handleAction}
      />
    </div>
  );
}
```

### Container Responsibilities
1. **State Management**: Local state and data fetching
2. **Business Logic**: Feature-specific logic and rules
3. **API Integration**: Data fetching and mutations
4. **Error Handling**: Error states and recovery
5. **Loading States**: Loading indicators and skeletons

## Feature Component Patterns

### Business Logic Component
```typescript
// containers/feature-name/components/business-component.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFeatureValidation } from "../hooks/use-feature-validation";

interface BusinessComponentProps {
  data: FeatureData;
  onUpdate: (data: FeatureData) => void;
  onCancel: () => void;
}

export function BusinessComponent({ data, onUpdate, onCancel }: BusinessComponentProps) {
  const [formData, setFormData] = useState<FeatureData>(data);
  const { validate, errors } = useFeatureValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validate(formData);
    if (!validationResult.isValid) {
      return;
    }

    try {
      await onUpdate(formData);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter name"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

### Data Display Component
```typescript
// containers/feature-name/components/data-display.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataDisplayProps {
  data: FeatureData[];
  onItemClick?: (item: FeatureData) => void;
}

export function DataDisplay({ data, onItemClick }: DataDisplayProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
              {item.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {onItemClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onItemClick(item)}
                className="mt-2"
              >
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

## Hook Patterns

### Custom Hook Structure
```typescript
// containers/feature-name/hooks/use-feature-logic.ts
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseFeatureLogicProps {
  data?: FeatureData;
  onUpdate?: (data: FeatureData) => void;
}

export function useFeatureLogic({ data, onUpdate }: UseFeatureLogicProps) {
  const [localState, setLocalState] = useState<FeatureState>(initialState);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newData: FeatureData) => {
      const result = await updateFeatureData(newData);
      return result;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['feature', updatedData.id], updatedData);
      onUpdate?.(updatedData);
    },
    onError: (error) => {
      console.error("Failed to update feature:", error);
    },
  });

  const handleAction = useCallback((action: FeatureAction) => {
    if (!data) return;

    const newState = processAction(localState, action);
    setLocalState(newState);

    if (action.type === 'save') {
      mutation.mutate({ ...data, ...newState });
    }
  }, [data, localState, mutation]);

  return {
    state: localState,
    handleAction,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
```

### Validation Hook Pattern
```typescript
// containers/feature-name/hooks/use-feature-validation.ts
import { useState, useCallback } from "react";
import { z } from "zod";

const featureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

export function useFeatureValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: FeatureData) => {
    try {
      featureSchema.parse(data);
      setErrors({});
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return { isValid: false, errors: fieldErrors };
      }
      return { isValid: false };
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    validate,
    errors,
    clearErrors,
  };
}
```

## Form Component Patterns

### Form Component Structure
```typescript
// containers/feature-name/components/feature-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

interface FeatureFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function FeatureForm({ initialData, onSubmit, onCancel }: FeatureFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## Layout Component Patterns

### Page Layout Structure
```typescript
// components/layouts/page-layout.tsx
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
```

## Error Handling Patterns

### Error Boundary Component
```typescript
// components/error-boundary.tsx
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### Error Display Component
```typescript
// components/error-display.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span>{error.message}</span>
          <div className="flex gap-2">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
```

## Loading State Patterns

### Loading Skeleton Component
```typescript
// components/loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function FeatureSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
```

### Loading Spinner Component
```typescript
// components/loading-spinner.tsx
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
```

## Best Practices

### 1. Component Composition
- Use composition over inheritance
- Break down complex components into smaller pieces
- Use render props and children patterns for flexibility

### 2. Props Interface Design
- Use descriptive prop names
- Provide sensible defaults
- Use TypeScript interfaces for all props
- Avoid prop drilling with context

### 3. State Management
- Keep state as local as possible
- Use custom hooks for complex state logic
- Separate server state from client state

### 4. Performance Optimization
- Use React.memo for expensive components
- Implement proper key props for lists
- Use useMemo and useCallback appropriately
- Avoid unnecessary re-renders

### 5. Accessibility
- Use semantic HTML elements
- Provide proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

This component pattern system provides a solid foundation for building maintainable, reusable, and accessible React components while following modern best practices and maintaining consistency throughout the application.
