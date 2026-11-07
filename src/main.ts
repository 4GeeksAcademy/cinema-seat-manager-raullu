// Cada asiento solo puede estar libre (0) u ocupado (1).
type Seat = 0 | 1;
type SeatMap = Seat[][];

const ROWS = 8;
const COLUMNS = 10;

// Crea una sala vacia de 8 filas por 10 columnas.
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

  let header = "       |";
  for (let column = 1; column <= COLUMNS; column += 1) {
    if (column < 10) {
      header += ` ${column} |`;
    } else {
      header += `${column} |`;
    }
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
    !Number.isInteger(row) || !Number.isInteger(column) ||
    row < 1 || row > ROWS ||
    column < 1 || column > COLUMNS
  ) {
    return `Reserva fallida: fila ${row} y columna ${column} deben ser enteros entre 1-${ROWS} y 1-${COLUMNS}, respectivamente.`;
  }

  if (room[row - 1][column - 1] === 1) {
    return `Asiento ya ocupado (fila ${row}, columna ${column}).`;
  }

  room[row - 1][column - 1] = 1;
  return `Reserva confirmada (fila ${row}, columna ${column}).`;
}

// Cuenta los asientos ocupados y disponibles en toda la sala.
function countSeats(room: SeatMap): [occupied: number, available: number] {
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

  return [occupied, available];
}

// Devuelve todas las parejas libres de una misma fila, incluidas las solapadas.
function findAdjacentSeats(
  room: SeatMap,
): [row: number, firstColumn: number, secondColumn: number][] {
  const pairs: [row: number, firstColumn: number, secondColumn: number][] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS - 1; column += 1) {
      if (room[row][column] === 0 && room[row][column + 1] === 0) {
        pairs.push([row + 1, column + 1, column + 2]);
      }
    }
  }

  return pairs;
}

// Muestra un resumen consistente para cada escenario de prueba.
function showSummary(room: SeatMap): void {
  const counts = countSeats(room);
  console.log(`Ocupados: ${counts[0]} | Disponibles: ${counts[1]}`);
  if (counts[1] === 0) {
    console.log("Estado: sala completamente llena.");
  } else if (counts[1] <= 5) {
    console.log("Estado: sala casi llena.");
  } else if (counts[0] === 0) {
    console.log("Estado: sala vacía.");
  } else {
    console.log("Estado: sala parcialmente ocupada.");
  }
  const adjacentSeats = findAdjacentSeats(room);
  if (adjacentSeats.length > 0) {
    console.log(`Parejas de asientos contiguos disponibles: ${adjacentSeats.length}`);
    for (let index = 0; index < adjacentSeats.length; index += 1) {
      const pair = adjacentSeats[index];
      console.log(
        `Asientos contiguos encontrados: fila ${pair[0]}, columnas ${pair[1]} y ${pair[2]}.`,
      );
    }
  } else {
    console.log("No hay asientos contiguos disponibles.");
  }
}

// Se utiliza una única matriz, modificada progresivamente en los escenarios.
const room = initializeRoom();

console.log("ESCENARIO A: sala vacía");
showSummary(room);
displayRoom(room);

console.log("\nESCENARIO B: sala parcialmente ocupada");
console.log(reserveSeat(room, 1, 1));
// Combina asientos sueltos con parejas y un grupo de tres libres.
for (let row = 1; row <= ROWS; row += 1) {
  for (let column = 1; column <= COLUMNS; column += 1) {
    const keepAvailable = column === 3 || column === 5 ||
      (row % 2 === 0 && column === 6) ||
      (row === 2 && column === 7);
    if (room[row - 1][column - 1] === 0 && !keepAvailable) {
      reserveSeat(room, row, column);
    }
  }
}
console.log(reserveSeat(room, 1, 1)); // Comprueba que no se reserve dos veces.
showSummary(room);
displayRoom(room);

console.log("\nESCENARIO C: sala casi llena; quedan asientos sueltos");
// Conserva cinco asientos libres aislados, sin liberar reservas anteriores.
for (let row = 1; row <= ROWS; row += 1) {
  for (let column = 1; column <= COLUMNS; column += 1) {
    const keepAvailable = (row <= 4 && column === 3) ||
      (row === 1 && column === 5);
    if (room[row - 1][column - 1] === 0 && !keepAvailable) {
      reserveSeat(room, row, column);
    }
  }
}
showSummary(room);
displayRoom(room);

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
