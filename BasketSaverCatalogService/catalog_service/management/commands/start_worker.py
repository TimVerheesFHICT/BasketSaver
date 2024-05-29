import pika
import json

from catalog_service.models import Item

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='some-rabbit'))

channel = connection.channel()

channel.queue_declare(queue='gc_list_request')


def on_request(ch, method, props, body):
    decoded_body = body.decode('utf-8')
    filtered_body = decoded_body.replace("\'", "\"")
    payload = json.loads(filtered_body)
    for store in payload:
        for item in store["items"]:
            found_item = Item.objects.get(pk=item["item"])
            item["name"] = found_item.name
            item["url"] = found_item.url
            item["price"] = str(found_item.price)
            item["weight"] = found_item.weight
    response = payload

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='gc_list_request', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()