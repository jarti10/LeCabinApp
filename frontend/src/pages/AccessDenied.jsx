function AccessDenied() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Acceso denegado</h1>
      <p className="mt-4 text-gray-600">No tienes permisos para acceder a esta página.</p>
    </div>
  );
}

export default AccessDenied;
