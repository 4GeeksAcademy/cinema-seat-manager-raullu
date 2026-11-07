// Cada asiento solo puede estar libre (0) u ocupado (1).
type Seat = 0 | 1;
type SeatMap = Seat[][];

const ROWS = 8;
const COLUMNS = 10;

// Crea una sala vacía de 8 filas por 10 columnas.
function initializeRoom(): SeatMap {
  const room: SeatMap = [];

  for (let row = 0; row < ROWS; row += 1) {
    const seats: Seat[] = [];
    for (let column = 0; column < COLUMNS; column += 1) {
      seats.push(0);
    }
    room.push(seats);
  }

  return room;
}

// Imprime visualmente la sala con encabezados, bordes y una leyenda.
function displayRoom(room: SeatMap): void {
  console.log("\nEstado de la sala: L = libre | X = ocupado");

  let header = "        ";
  for (let column = 1; column <= COLUMNS; column += 1) {
    header += ` ${column} `;
  }
  console.log(header);

  for (let row = 0; row < ROWS; row += 1) {
    let line = `Fila ${row + 1} |`;
    for (let column = 0; column < COLUMNS; column += 1) {
      const seat = room[row][column] === 1 ? "X" : "L";
      line += ` ${seat} |`;
    }
    console.log(line);
  }
}

// Reserva un asiento si las coordenadas son válidas y está libre.
function reserveSeat(room: SeatMap, row: number, column: number): string {
  if (
    row < 1 || row > ROWS ||
    column < 1 || column > COLUMNS
  ) {
    return `Reserva fallida: fila ${row} o columna ${column} fuera de rango.`;
  }

  if (room[row - 1][column - 1] === 1) {
    return `Asiento ya ocupado (fila ${row}, columna ${column}).`;
  }

  room[row - 1][column - 1] = 1;
  return `Reserva confirmada (fila ${row}, columna ${column}).`;
}

// Cuenta los asientos ocupados y disponibles en toda la sala.
function countSeats(room: SeatMap): { occupied: number; available: number } {
  let occupied = 0;
  let available = 0;

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      if (room[row][column] === 1) {
        occupied += 1;
      } else {
        available += 1;
      }
    }
  }

  return { occupied, available };
}

// Busca el primer par de asientos libres contiguos de una misma fila.
function findAdjacentSeats(
  room: SeatMap,
): { row: number; firstColumn: number; secondColumn: number } | null {
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS - 1; column += 1) {
      if (room[row][column] === 0 && room[row][column + 1] === 0) {
        return {
          row: row + 1,
          firstColumn: column + 1,
          secondColumn: column + 2,
        };
      }
    }
  }

  return null;
}

// Muestra un resumen consistente para cada escenario de prueba.
function showSummary(room: SeatMap): void {
  const counts = countSeats(room);
  console.log(`Ocupados: ${counts.occupied} | Disponibles: ${counts.available}`);
  const adjacentSeats = findAdjacentSeats(room);
  if (adjacentSeats) {
    console.log(
      `Asientos contiguos encontrados: fila ${adjacentSeats.row}, columnas ${adjacentSeats.firstColumn} y ${adjacentSeats.secondColumn}.`,
    );
  } else {
    console.log("No hay asientos contiguos disponibles.");
  }
}

// Se utiliza una única matriz, modificada progresivamente en los cuatro escenarios.
const room = initializeRoom();

console.log("ESCENARIO A: sala vacía");
displayRoom(room);
showSummary(room);

console.log("\nESCENARIO B: sala parcialmente ocupada");
console.log(reserveSeat(room, 1, 1));
console.log(reserveSeat(room, 2, 2));
console.log(reserveSeat(room, 4, 3));
console.log(reserveSeat(room, 1, 1)); // Comprueba que no se reserve dos veces.
displayRoom(room);
showSummary(room);

console.log("\nESCENARIO C: sala casi llena; quedan asientos sueltos");
// Deja libres únicamente los asientos (fila 1, columnas 3 y 5), que no son contiguos.
for (let row = 1; row <= ROWS; row += 1) {
  for (let column = 1; column <= COLUMNS; column += 1) {
    const isOneOfTheTwoRemainingSeats =
      row === 1 && (column === 3 || column === 5);
    if (room[row - 1][column - 1] === 0 && !isOneOfTheTwoRemainingSeats) {
      reserveSeat(room, row, column);
    }
  }
}
displayRoom(room);
showSummary(room);

console.log("\nESCENARIO D: sala completamente llena");
for (let row = 0; row < ROWS; row += 1) {
  for (let column = 0; column < COLUMNS; column += 1) {
    if (room[row][column] === 0) {
      reserveSeat(room, row + 1, column + 1);
    }
  }
}
showSummary(room);
displayRoom(room);
