import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Tareqs Bazaar - Admin",
    description: "Tareqs Bazaar - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
