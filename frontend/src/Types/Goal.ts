export interface Goal {
  id: string;
  name: string;
  type: "short-term" | "long-term";
  target_amount: number;
  deadline: string ;

}