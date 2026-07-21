import Swal from "sweetalert2";

export async function alertaSucesso(titulo: string) {
  await Swal.fire({
    icon: "success",
    title: titulo,
    timer: 1500,
    showConfirmButton: false,
  });
}

export async function alertaErro(
  titulo: string,
  texto: string
) {
  await Swal.fire({
    icon: "error",
    title: titulo,
    text: texto,
  });
}

export async function alertaAviso(
  titulo: string,
  texto: string
) {
  await Swal.fire({
    icon: "warning",
    title: titulo,
    text: texto,
  });
}

export async function confirmarExclusao() {
  return await Swal.fire({
    title: "Excluir registro?",
    text: "Essa ação não poderá ser desfeita.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Excluir",
    cancelButtonText: "Cancelar",
  });
}