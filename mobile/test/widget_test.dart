import 'package:flutter_test/flutter_test.dart';
import 'package:plant_app/main.dart';

void main() {
  testWidgets('App launches smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const PlantApp());
    expect(find.byType(PlantApp), findsOneWidget);
  });
}
