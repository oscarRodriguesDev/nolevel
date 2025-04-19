import Loader from "../dashComponents/common/Loader";
import { Login } from "../login";

interface LoadProps {
  carregando: boolean;
}
export function PageLogin({ carregando }: LoadProps) {
  return <div>{carregando ? <Loader /> : <Login />}</div>;
}
