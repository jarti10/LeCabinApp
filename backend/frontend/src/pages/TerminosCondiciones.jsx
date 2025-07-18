function TerminosCondiciones() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Términos y Condiciones de Uso</h1>
      <p className="mb-4">
        Al registrarte y utilizar esta aplicación, aceptas los siguientes términos:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tu información será usada únicamente para gestionar tus reservas y citas.</li>
        <li>No compartiremos tus datos con terceros sin tu consentimiento.</li>
        <li>Puedes solicitar la eliminación de tu cuenta en cualquier momento.</li>
        <li>Las reservas están sujetas a disponibilidad y a la política de cancelación vigente.</li>
        <li>No se podrán realizar reservas en días festivos o fuera del rango permitido.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">
        Fecha de última actualización: 7 de julio de 2025
      </p>
    </div>
  );
}

export default TerminosCondiciones;
