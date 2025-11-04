import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

interface AllTheProvidersProps {
	children: ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	wrapper?: (props: { children: ReactNode }) => ReactElement;
}

function customRender(
	ui: ReactElement,
	options: CustomRenderOptions = {},
): ReturnType<typeof render> {
	const { wrapper: Wrapper, ...renderOptions } = options;

	if (Wrapper) {
		return render(ui, {
			wrapper: ({ children }) => (
				<AllTheProviders>
					<Wrapper>{children}</Wrapper>
				</AllTheProviders>
			),
			...renderOptions,
		});
	}

	return render(ui, {
		wrapper: AllTheProviders,
		...renderOptions,
	});
}

// Re-export everything
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Override render method
export { customRender as render };
