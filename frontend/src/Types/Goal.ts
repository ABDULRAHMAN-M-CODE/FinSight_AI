export interface Goal {
  id: number;
  name: string;
  type: "short-term" | "long-term";
  target_amount: number;
  deadline: string ;

}