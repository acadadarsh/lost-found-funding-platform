
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemForm from "@/components/items/ItemForm";

const CreateItemPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Post an Item</h1>
            <p className="text-gray-500">Fill out the form below to post a lost or found item</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <ItemForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateItemPage;
