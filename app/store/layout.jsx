import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Tareqs Bazaar - Store Dashboard",
    description: "Tareqs Bazaar - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
